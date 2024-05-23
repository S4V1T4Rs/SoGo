const sendEmail = async () => {
  let dataSend = {
    email: email,
    subject: subject,
    message: message,
  };

  await fetch(`${baseUrl}/email/sendEmail`, {
    method: "POST",
    body: JSON.stringify(dataSend),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    // HANDLING ERRORS
    .then((res) => {
      console.log(res);
      if (res.status > 199 && res.status < 300) {
        alert("Send Successfully !");
      }
    });
};