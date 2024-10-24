import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from "googleapis";
dotenv.config();

const app = express();
const OAuth2 = google.auth.OAuth2;

const { APP_CLIENT_ID, APP_CLIENT_SECRET, REDIRECT_URI, PORT } = process.env;

app.use(cors());

app.use(express.json());

const oauth2Client = new OAuth2(
    APP_CLIENT_ID,
    APP_CLIENT_SECRET,
    REDIRECT_URI
);

app.get("/", (_req, res) => {
    res.send("Welcome to WriteFlow API");
});

app.post('/verify-token', async (req, res) => { // apart from verifying the token, generates URL to grant access to services/scopes
    
    console.log('req body: ', req.body)
    const verifyToken = await oauth2Client.verifyIdToken({
        idToken: req.body.response.credential,
        audience: req.body.response.clientId
    })

    console.log('Verify Token: ', verifyToken)

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/documents.readonly'],
    });

    res.send({authUrl})
});

app.post('/generate-access-token', async (req, res) => { 
    // console.log('req', req)
      const code = req.body.code;
      const { tokens } = await oauth2Client.getToken(code);
      res.send({Message: 'Authorization successful! You can now access Google Docs.', tokens});
});

app.post('/documents', async (req, res) => {
    const token = req.body.token;
    console.log('token', token)
    if(!token){
      return res.status(400).json({error: 'Token is missing'})
    }

      oauth2Client.setCredentials({
        access_token: token
      });

      const drive = google.drive({version: "v3", auth: oauth2Client});


      const response = await drive.files.list({
          q: "mimeType='application/vnd.google-apps.document'",
          fields: 'files(id, name, description, ownedByMe, modifiedByMeTime)',
      });

      const files = response.data.files.filter((file) => file.ownedByMe)

      res.json(files); 
});

app.get('/documents/:docId', async (req, res) => {
    const docs = google.docs({ version: 'v1', auth: oauth2Client });
    const documentId = req.params.docId;

    if(!documentId){
      return res.status(400).json({error: 'Document is undefined'})
    }
  
    const response = await docs.documents.get({
      documentId: documentId,
    });
  
    const docContent = response.data.body.content;
    console.log('Doc Content', docContent)
  
    let wordCount = 0;
    docContent.forEach(element => {
        console.log('Element: ', element)
      if (element.paragraph) {
        element.paragraph.elements.forEach(e => {
          if (e.textRun) {
            console.log('E textRun.content: ', e.textRun.content)
            wordCount += e.textRun.content.split(/\s+/).filter(word => word.length > 0).length;
          }
        });
      }
    });
  
    res.json({ wordCount });
});

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
});