import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Button, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const EmailSenderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Mensajes = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateType, setCandidateType] = useState('entrevistado');
  const [emailSent, setEmailSent] = useState(false); // Estado para controlar si el correo ya se envió

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/candidato');
        setEmails(response.data);
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    };

    fetchEmails();
  }, []);

  useEffect(() => {
    setSelectedEmail('');
    setSelectedCandidate(null);
    setEmailSent(false); // Reiniciar el estado cuando cambia el tipo de candidato
  }, [candidateType]);

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const sendEmail = async () => {
    const fullMessage = message;

    const formData = new FormData();
    formData.append('email', selectedEmail);
    formData.append('subject', subject);
    formData.append('message', fullMessage);
    formData.append('attachment', attachment);

    try {
      const res = await axios.post('http://localhost:8080/api/sendEmail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.status >= 200 && res.status < 300) {
        alert('Send Successfully!');
        setEmailSent(true); // Marcar el correo como enviado
      } else {
        console.error('Failed to send email:', res.statusText);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleEmailSelect = (e) => {
    const selectedEmail = e.target.value;
    setSelectedEmail(selectedEmail);
    const candidate = emails.find((candidato) => candidato.email === selectedEmail);
    setSelectedCandidate(candidate);
  };

  const filteredEmails = emails.filter((candidato) => candidato.selectionStatus === candidateType);

  return (
    <EmailSenderContainer>
      <FormControl fullWidth margin="normal">
        <InputLabel id="candidate-type-select-label">Seleccione un estado</InputLabel>
        <Select
          labelId="candidate-type-select-label"
          value={candidateType}
          label="Seleccione un estado"
          onChange={(e) => setCandidateType(e.target.value)}
        >
          <MenuItem value="entrevistado">Entrevistado</MenuItem>
          <MenuItem value="seleccionado">Seleccionado</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="email-select-label">Seleccionar Email</InputLabel>
        <Select labelId="email-select-label" value={selectedEmail} onChange={handleEmailSelect} label="Seleccionar Email">
          {filteredEmails.map((candidato) => (
            <MenuItem key={candidato.id} value={candidato.email}>
              {candidato.email}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} fullWidth margin="normal" />
      <TextField
        label="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
        multiline
        rows={4}
        margin="normal"
      />
      {selectedCandidate && (
        <>
          <TextField label="DNI" value={selectedCandidate.documentNumber} fullWidth margin="normal" disabled />
          <TextField label="First Name" value={selectedCandidate.firstName || ''} fullWidth margin="normal" disabled />
          <TextField label="Last Name" value={selectedCandidate.lastName || ''} fullWidth margin="normal" disabled />
        </>
      )}

      <input type="file" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={sendEmail} disabled={emailSent}>
        {emailSent ? 'Email Sent' : 'Send Email'}
      </Button>
    </EmailSenderContainer>
  );
};

export default Mensajes;
