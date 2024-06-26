export default [
	{
		statements: [
			'CREATE TABLE "tasks" (\n  "id" TEXT NOT NULL,\n  "title" TEXT NOT NULL,\n  "description" TEXT,\n  "status" TEXT NOT NULL,\n  "created_at" TEXT NOT NULL,\n  "updated_at" TEXT NOT NULL,\n  "due_date" TEXT,\n  "priority" TEXT NOT NULL,\n  CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")\n) WITHOUT ROWID;\n',
			"INSERT OR IGNORE INTO _electric_trigger_settings (namespace, tablename, flag) VALUES ('main', 'tasks', 1);",
			"DROP TRIGGER IF EXISTS update_ensure_main_tasks_primarykey;",
			'CREATE TRIGGER update_ensure_main_tasks_primarykey\n  BEFORE UPDATE ON "main"."tasks"\nBEGIN\n  SELECT\n    CASE\n      WHEN old."id" != new."id" THEN\n      \t\tRAISE (ABORT, \'cannot change the value of column id as it belongs to the primary key\')\n    END;\nEND;',
			"DROP TRIGGER IF EXISTS insert_main_tasks_into_oplog;",
			"CREATE TRIGGER insert_main_tasks_into_oplog\n   AFTER INSERT ON \"main\".\"tasks\"\n   WHEN 1 = (SELECT flag from _electric_trigger_settings WHERE namespace = 'main' AND tablename = 'tasks')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'tasks', 'INSERT', json_patch('{}', json_object('id', new.\"id\")), json_object('created_at', new.\"created_at\", 'description', new.\"description\", 'due_date', new.\"due_date\", 'id', new.\"id\", 'priority', new.\"priority\", 'status', new.\"status\", 'title', new.\"title\", 'updated_at', new.\"updated_at\"), NULL, NULL);\nEND;",
			"DROP TRIGGER IF EXISTS update_main_tasks_into_oplog;",
			"CREATE TRIGGER update_main_tasks_into_oplog\n   AFTER UPDATE ON \"main\".\"tasks\"\n   WHEN 1 = (SELECT flag from _electric_trigger_settings WHERE namespace = 'main' AND tablename = 'tasks')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'tasks', 'UPDATE', json_patch('{}', json_object('id', new.\"id\")), json_object('created_at', new.\"created_at\", 'description', new.\"description\", 'due_date', new.\"due_date\", 'id', new.\"id\", 'priority', new.\"priority\", 'status', new.\"status\", 'title', new.\"title\", 'updated_at', new.\"updated_at\"), json_object('created_at', old.\"created_at\", 'description', old.\"description\", 'due_date', old.\"due_date\", 'id', old.\"id\", 'priority', old.\"priority\", 'status', old.\"status\", 'title', old.\"title\", 'updated_at', old.\"updated_at\"), NULL);\nEND;",
			"DROP TRIGGER IF EXISTS delete_main_tasks_into_oplog;",
			"CREATE TRIGGER delete_main_tasks_into_oplog\n   AFTER DELETE ON \"main\".\"tasks\"\n   WHEN 1 = (SELECT flag from _electric_trigger_settings WHERE namespace = 'main' AND tablename = 'tasks')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'tasks', 'DELETE', json_patch('{}', json_object('id', old.\"id\")), NULL, json_object('created_at', old.\"created_at\", 'description', old.\"description\", 'due_date', old.\"due_date\", 'id', old.\"id\", 'priority', old.\"priority\", 'status', old.\"status\", 'title', old.\"title\", 'updated_at', old.\"updated_at\"), NULL);\nEND;",
		],
		version: "1",
	},
];
