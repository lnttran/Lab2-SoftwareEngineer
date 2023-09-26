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
import { useNavigate, useParams } from 'react-router-dom';
import AuthService from '../../services/auth';
import axios from 'axios';

const ResetPassword: React.FC = () => {

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    // returns an objects of kay/value pairs of the dynamic params from the current URL
    const { jwt } = useParams();

    useEffect(() => {
        // send to endpoint to verify jwt token exist
        console.log(jwt);
        // if exist continue

        // else navigtate('login')
    }, [jwt])

    //FormEvent : form submisison event 
    const handleSubmit = (event: FormEvent) => {
        //this lien prevent any default submission like reload or navigation 
        event.preventDefault();

        //if the password does not match, then return 
        if (newPassword !== confirmPassword) {
            setMessage("Passwords does not match");
            return;
        }

        setMessage("");
        setLoading(true);

        if (jwt) {
            AuthService.resetPassword(jwt, newPassword).then(
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
        } else {
            setMessage("Invalid token.");
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8, }}>
                <Typography component="h1" variant="h5"> Reset Password </Typography>
                <Box component="form" onSubmit={handleSubmit} mt={3}>
                    <TextField label="New Password" margin="normal" required fullWidth autoComplete="password" onChange={(e) => setNewPassword(e.target.value)} value={newPassword} autoFocus />
                    <TextField label="Confirm Password" margin="normal" required fullWidth autoComplete="password" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} autoFocus />
                    <LoadingButton type="submit" variant="contained" loading={loading} sx={{ mt: 4, mb: 3 }}>Reset Password</LoadingButton>
                    <FormHelperText>{message}</FormHelperText>
                </Box>
            </Box>
        </Container>
    );
};

export default ResetPassword;
