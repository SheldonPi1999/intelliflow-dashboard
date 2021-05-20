import { Application } from '../declarations';
// Don't remove this comment. It's needed to format import lines nicely.

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
export default function(app: Application): void {
  app.post('/uploads', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    const sampleFile = req.files.file;
    // Use the mv() method to place the file somewhere on your server
    // eslint-disable-next-line
    // @ts-ignore
    sampleFile.mv(`./public/images/${sampleFile.name}`, (err: any) => {
      if (err) {
        console.log(err);
      }
      res.send(200);
    });
  });
}
