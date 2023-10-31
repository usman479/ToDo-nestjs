// import { Comment } from 'src/entities/comment.entity';
// import { Topic } from 'src/entities/topic.entity';
import { SubTask } from 'src/entities/sub-task.entity';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  database: 'testDB',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  entities: [User, Task,SubTask],
  synchronize: true,
};

export default config;
