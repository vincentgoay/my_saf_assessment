/*
Attempting to get:
const getGames = mkQuery('select * from game', pool);
const getCommentById = mkQuery('select * from comment where gid = ?', pool);
*/

const mkQuery = function (sql, pool) {
    const f = function (params) {
        const p = new Promise(
            (resolve, reject) => {
                pool.getConnection(
                    (err, conn) => {
                        if (err)
                            return reject(err);

                        conn.query(sql,
                            params || [],   // default empty array
                            (err, result) => {
                                conn.release();
                                if (err)
                                    return reject(err);
                                resolve(result);
                            })
                    });
            }
        )
        return (p);
    }
    return (f);
}

module.exports = mkQuery;
