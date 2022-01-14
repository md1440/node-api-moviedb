import { dbConnectionEvents, dbConnect } from './db.js';
import app from './app.js';

dbConnectionEvents();
dbConnect();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Server running on Port: ${PORT}`);
  }
});
