import mysql from 'rx-mysql';

const db = await mysql({
    host:'localhost',
    database: 'pathways',
    user:'wittandrew',
    password: 'Solitude1',
    port: 3306
});
// for db remove port and add for ssh
// sshTunnel: {
//     sshOptions: {
//         port: 22,
//         username: 'wittandrew',
//         host: '',
//         privateKeyFile: '/path/to/certs/id_rsa'
//     },
//     forwardOptions: {
//         dstAddr: 'localhost',
//         dstPort: 3377,
//     }
//}

const { query, getInstance, dissconnect } = db;
// eg const nativeResults = await query(
//   'SELECT user_id, user_name FROM users',
//   null,
//   { nativeQuery: true }
// );

// async function main() {
//   const { getInstance, disconnect } = await mysql();
//   const db = getInstance();

//   let transaction;
//   try {
//     transaction = await db.beginTransaction();

//     // Execute queries within the transaction
//     await transaction.query('INSERT INTO users (name) VALUES (:name)', { name: 'John Doe' });
//     await transaction.query('UPDATE products SET stock = stock - 1 WHERE id = :id', { id: 101 });

//     await transaction.commit();
//     console.log('Transaction committed successfully.');
//   } catch (error) {
//     if (transaction) {
//       await transaction.rollback();
//       console.log('Transaction rolled back due to error:', error);
//     } else {
//       console.error('Error starting transaction:', error);
//     }
//   } finally {
//     await disconnect();
//   }
// }




export default { query, getInstance, dissconnect };
