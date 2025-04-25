import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Tabs,
  Tab,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  OutlinedInput,
  FormControl,
  Grid2,
  InputAdornment,
  InputLabel,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import { getForgotPasswordUrl } from "../../helpers/authHelper";
import { webApi } from "../../api";

const AuthDialog = ({ open, onClose, handleRegister, handleLogin }) => {
  const [tab, setTab] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const onLogin = async () => {
    const login = await handleLogin(email, password);
    if (login) {
      onClose();
    }
  }

  const onRegister = async () => {
    const register = await handleRegister(firstName, lastName, email, password, confirmPassword);
    if (register) {
      onClose();
    }
  }

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onClose(event);
        }
      }}
      maxWidth="xs"
      fullWidth
      className="login-dialog"
    >
      <DialogContent sx={{ pb: 4 }}>
        <Tabs
          sx={{ mb: 3 }}
          value={tab}
          variant="fullWidth"
          onChange={(e, newValue) => setTab(newValue)}
          centered
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        {tab === 1 ? (
          <>
            <Grid2 container spacing={3}>
              <Grid2 size={6}>
                <TextField
                  className="custom-login-input"
                  required
                  size="small"
                  fullWidth
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  label="First Name"
                  variant="outlined"
                />
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  className="custom-login-input"
                  size="small"
                  required
                  fullWidth
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  label="Last Name"
                  variant="outlined"
                />
              </Grid2>
              <Grid2 size={12}>
                <TextField
                  className="custom-login-input"
                  size="small"
                  required
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  label="Email"
                  variant="outlined"
                />
              </Grid2>
              <Grid2 size={12}>
                <FormControl size="small" fullWidth variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password-register">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="outlined-adornment-password-register"
                    type={showPassword ? "text" : "password"}
                    className="custom-login-input"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          sx={{ m: 0, fontSize: 16 }}
                          aria-label={
                            showPassword
                              ? "hide the password"
                              : "display the password"
                          }
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
              </Grid2>
              <Grid2 size={12}>
                <FormControl size="small" fullWidth variant="outlined">
                  <InputLabel
                    htmlFor="outlined-adornment-password"
                    sx={{ background: "#fff", pr: 1 }}
                  >
                    Confirm Password
                  </InputLabel>
                  <OutlinedInput
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    id="outlined-adornment-password"
                    className="custom-login-input"
                    type={showConfirmPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          sx={{ m: 0, fontSize: 16 }}
                          aria-label={
                            showConfirmPassword
                              ? "hide the password"
                              : "display the password"
                          }
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
              </Grid2>
            </Grid2>
            <Box
              display={"flex"}
              alignItems={"center"}
              flexDirection={"column"}
              gap={1}
              mt={3}
            >
              <Button
                variant="contained"
                sx={{ width: 200, color: "#fff", fontWeight: 600, minHeight: 0 }}
                onClick={onRegister}
              >
                PROCEED
              </Button>
            </Box>
          </>
        ) : (
          <>
            <>
              <Grid2 container spacing={3}>
                <Grid2 size={12}>
                  <TextField
                    className="custom-login-input"
                    size="small"
                    required
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    label="Email"
                    variant="outlined"
                  />
                </Grid2>
                <Grid2 size={12}>
                  <FormControl size="small" fullWidth variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      className="custom-login-input"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            sx={{ m: 0, fontSize: 16 }}
                            aria-label={
                              showPassword
                                ? "hide the password"
                                : "display the password"
                            }
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </FormControl>
                </Grid2>
              </Grid2>
              <Typography my={3} fullWidth textAlign={"end"}>
                <a href={getForgotPasswordUrl()}>Forgotten Passowrd?</a>
              </Typography>
              <Box
                display={"flex"}
                alignItems={"center"}
                flexDirection={"column"}
                gap={1}
              >
                <Button
                  variant="contained"
                  sx={{ width: 200, color: "#fff", fontWeight: 600, minHeight: 0 }}
                  onClick={onLogin}
                >
                  LOGIN
                </Button>
              </Box>
            </>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
