import * as nodemailer from 'nodemailer';

export const enviaMail = async function () {
  const mailAuth = {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  };

  let mailOptions = {
    from: `Sigedin-ITP <${mailAuth.user}>`,
    to: 'durosero@itp.edu.co',
    subject: 'Mensaje de prueba',
    // 'html': dataMail.mensaje
    text: 'hola mundo',
    // attachments: fileBuffer,
  };

  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: mailAuth

    });

    //mailOptions.from = `Sigedin-ITP <${gmail.user}>`;
    transporter.sendMail(mailOptions, function (err, info) {
      console.log('enviando email...');
      console.log(mailOptions);
      if (err) {
        console.log(err);
        reject(err);
        console.log('Error al enviar el email');
        //console.error(err);
      } else {
        //    console.log(info);
        resolve(true);
      }
    });
  });
};
