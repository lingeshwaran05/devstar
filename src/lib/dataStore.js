import * as sqlite3 from "sqlite3";
const sqlite = sqlite3.verbose();
const db = new sqlite.Database("./pastes.db");

export async function insertPaste(data) {
  const newData = [
    data.id,
    data.title,
    data.text,
    data.password,
    data.encrypted,
    data.paste_expiration,
  ];
  return new Promise((resolve, reject) => {
    db.serialize(function () {
      db.run(
        "CREATE TABLE IF NOT EXISTS pastes (id TEXT, title TEXT, text TEXT, password TEXT,encrypted BOOLEAN, paste_expiration TEXT)"
      );
      db.run(
        "INSERT INTO pastes (id, title,text,password,encrypted,paste_expiration) VALUES (?,?,?,?,?,?)",
        newData
      );

      resolve()
    });
  });
}

export async function getPaste(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM pastes WHERE id=?", id, function (err, rows) {
      if (err) {
        reject(err);
      }
      resolve(rows)
    });
  });
}