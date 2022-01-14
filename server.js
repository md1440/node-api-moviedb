'use strict';

import mongoose from 'mongoose';
import { app } from './app';

const port = 3333;
const ip = '127.0.0.1';

app.listen(port, ip, () => {
  console.log(`Server running on http://${ip}:${port}`);
});
