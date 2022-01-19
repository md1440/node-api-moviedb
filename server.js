import { dbConnectionEvents, dbConnect } from './db/db.js';
import app from './app.js';

// *** Database
// 1) Loading the Event Listeners for the Connection
dbConnectionEvents();
// 2) Connecting the DB
dbConnect();

// *** Server Config & Start
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Server running on Port: ${PORT}`);
  }
});
