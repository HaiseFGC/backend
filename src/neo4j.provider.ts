import { Provider } from '@nestjs/common';
import neo4j from 'neo4j-driver';

export const NEO4J_DRIVER = 'NEO4J_DRIVER';

export const neo4jProvider: Provider = {
  provide: NEO4J_DRIVER,
  useFactory: () => {
    return neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'password'));
  },
};