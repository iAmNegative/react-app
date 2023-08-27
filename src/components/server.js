import React, { useState, useEffect } from "react";



const express = require('express');
const cors = require('cors');

const app = express();
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));
// ...

