import app from './app';
import { logger } from './util/logger';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`listening on ${PORT}`);
});
