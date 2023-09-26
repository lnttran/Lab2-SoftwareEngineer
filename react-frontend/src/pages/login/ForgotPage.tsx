import React, { useState, FormEvent, useEffect } from 'react';
import {
    Box,
    Grid,
    Link,
    Container,
    FormHelperText,
    TextField,
    Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthService from '../../services/auth';

const ForgotPage: React.FC = () => {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        setMessage("");
        setLoading(true);

        AuthService.forgotPassword(email).then(
            () => {
                navigate("/login");
                // window.location.reload();
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setLoading(false);
                setMessage(resMessage);
            }
        );
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8, }}>
                <Typography component="h1" variant="h5"> Forgot Password </Typography>
                <Box component="form" onSubmit={handleSubmit} mt={3}>
                    <TextField label="Email" margin="normal" required fullWidth autoComplete="email" onChange={(e) => setEmail(e.target.value)} value={email} autoFocus />
                    <LoadingButton type="submit" variant="contained" loading={loading} sx={{ mt: 4, mb: 3 }}>Send Reset Email</LoadingButton>
                    <FormHelperText>{message}</FormHelperText>
                </Box>
            </Box>
        </Container>
    );
};

export default ForgotPage;
