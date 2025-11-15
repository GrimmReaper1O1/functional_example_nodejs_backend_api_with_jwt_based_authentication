   import bcrypt from 'bcrypt';
   import jwt from 'jsonwebtoken';
   import query from './../querys/querys.js';
   
  const {insertIntoUsers, fetchUserViaEmail, updateFailedAttempts, resetFailedAttempts} = query;

  async function signup(req, res)  { 
                const { username, email, password } = req.body;
                let hashedPassword = await bcrypt.hash(password, 10); // do research on this as to why it might be better.
                hashedPassword = hashedPassword.trim();
               let result0 = await fetchUserViaEmail(email);
                console.log(result0);
              if (result0.length < 1) {
                let result = insertIntoUsers(username, hashedPassword, email);
                console.log(result);
                if (result.affectedRows === 0) {
                  res.status(500).json({error: 'No user was inserted!'});
                } 

                let result1 = await fetchUserViaEmail(email);
                  const token = jwt.sign({ id: result1[0].id }, process.env.SECRET_KEY, { expiresIn: '1h' });
                  console.log(token);
                  res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Only change to secure in production true value
                    sameSite: 'lax', // do strict in production
                    
                    path: '/',
                    maxAge: 60 * 60 * 1000 * 3
                  });

                res.status(200).json({message: 'it was successfull', id: result1[0].id});
                
                } else {
                  res.status(501).json({error: 'Other user exists!'});
                }
              };
        
            
            async function  signin(req, res)  {
                const { email, password } = req.body;
              
               let results = await fetchUserViaEmail(email);
               console.log(results);
                if (results.length === 0) { 
                  res.status(401).json({ error: 'User not found' });
                }
                console.log('got to login');
                let user = results[0];
                if (user.lastLogin === null) { 
                  user.lastLogin = Date.now();
                }
                console.log(user);
                if (user.failedAttempts < 5 && user.lastLogin > (Date.now()-30*60*60*1000)) {
                const isMatch = await bcrypt.compare(password, user.password);
                console.log(isMatch);
                if (!isMatch) {
                    let upResult = await updateFailedAttempts(user.id);
                    console.log(upResult);
                    return res.status(401).json({ error: 'Invalid credentials' });

                }
               
               
                let upResult = await resetFailedAttempts(user.id);
                   console.log(upResult); 
                const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
                      console.log(token);
                 res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax', // do strict in production
                    
                    path: '/',
                    maxAge: 60 * 60 * 1000 * 3
                  });

                res.status(200).json({ message: 'Login successful', id: user.id});
                } else {
                  console.log('locked out');
                  return res.status(401).json({error: 'Too many failed attempts. Please wait half an hour until next login.'})
                }
              };
            async function signout(req, res)  {
                  console.log('got to the end');
                res.clearCookie('token', {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === 'production', // Only change to secure in production 
                  sameSite: 'lax',// do strict in production
                 
                  path: '/'
                });
                res.status(200).json({message: 'signout successfull!'});

            }

export default {signup, signin, signout}