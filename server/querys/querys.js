import db from './../db.js';
// bind values with an object and the norm :valuetobind ', {valuetobind: variablename}
// check to see what happens if the connection to the database disapears.

// check to see if mysql-rx purifies the info. otherwise purify.
// auth routes 
// last_insert for mysql in mariaDB is it in it? can it be used in batch requests in begin and commit statements. prototype ver 2.
// LAST_INSERT_ID() usable in mariadb in batch statements 

// site admin user table include pagination later for future admins in prototype 2.0

const insertIntoAdminIndex = async (userId, priviledgeNumeral) => {
    const sql = 'insert into admin_index (userId, priviledges_numeral) values (:userId, :priviledgeNumeral)';
    return await db.query(sql, {userId: userId, priviledgeNumeral: priviledgeNumeral});
}
const selectFromAdminIndexViaUserId = async (userId) => {
    const sql = 'select * from admin_index where userId = :userId';
    return await db.query(sql, {userId});
}
const selectAllAdminIndexUsers = async () => {
    const sql =- 'select u.id as userId, a.id adminId, u.priviledges_numeral, u.email as email, u.username as username from  admin_index as a left join  users as u on u.id = a.userId';
    return await db.query(sql);
}


// average user table

const insertIntoUsers = async (username, hashedPassword, email) => {
   const sql = `INSERT INTO users (username, password, email, created, failed_attempts) VALUES (:username, :hashedPassword, :email, now(),0)`;
    return await db.query(sql, {username: username, hashedPassword: hashedPassword, email: email});
};

const fetchUserViaEmail = async (email) => {
    const sql = `select * from users where email = :email`;
    return await db.query(sql, {email: email});
                      
};

const updateFailedAttempts = async (id) => {
    const sql = `UPDATE users SET failed_attempts = failed_attempts+1, last_login = now() where id = :id`;
    return await db.query(sql, {id: id});
                        console.log(upResult);
};

const resetFailedAttempts = async (id) => {
    const sql = `UPDATE users SET failed_attempts = 0, last_login = now() where id = :id`;
    return await db.query(sql, {id: id});
};

// module route querys

const insertIntoModuleIndexTable = async (keyName, genre, userId, keywords, description, moduleName, timestampDA, competitionId, author) => {
    const sql = `INSERT INTO module_index_table (key_name, genre, userId, keywords, description, module_name, timestamp_display_after, competition_id, show_module, takedown_notice, timestamp, pen_name) VALUES (:keyName, :genre, :userId, :keywords, :description, :moduleName, :timestampDA, :competitionId, 0, 0, now(), :author);`;
    return await db.query(sql, {keyName: keyName, genre: genre, userId: userId, keywords: keywords, description: description, moduleName: moduleName, timestampDA: timestampDA, competitionId: competitionId, author: author});
};

const selectFromModuleIndexTableViaUserIdAndLetter = async (userId, letter) => {
    const sql = "select * from module_index_table where userId = :userId and module_name like :letter";
    return await db.query(sql, {userId: userId, letter: letter+'%'});
}

const searchModuleIndexTableViaStringAndField = async (stringArr, field ,enabled, numberOfRows, offset) => {
    let newField = '';    
    switch (field) {
        case 'keywords': 
        newField = 'keywords';
        break;
        case 'author':
        newField = 'pen_name';
        break;
        case 'title':
        newField = 'module_name';
        break;
    }


    let result1;
    if (enabled) {
    const sql1 = `select count(*) as count from module_index_table where ${newField} like :field `
    placeObj = {};
    
    placeObj.place0 = '%' + stringArr[0] + '%';
    for (let i = 1; i < stringArr.length; i++) {
        sql1 += `and ${newField} like :place${[i]} `;
        placeObj['place'+i] = '%' + stringArr[i] + '%';
    }
    sql1 += `;`;
    
   result1 = await db.query(sql1, placeObj);


    }


    let sql = `select u.id as userid, m.id as moduleId, m.key_name as key_name, m.keywords as keywords, m.description as description, m.module_name as module_name, m.genre as genre, u.username as author from users u right join module_index_table m on u.id = m.userId `;
    sql += `where m.${newField} like :place0 `;
    for (let i = 1; i < stringArr.length; i++) {
        sql += `and m.${newField}  like :place${[i]}} `;
    }
    place.offset = offset;
    place.numberOfRows = numberOfRows;
    sql += `order by m.${newField} ${(newField === 'module_name' ? '' : ', m.module_name')} asc offset :offset rows fetch next :numberOfRows rows only`;
    sql += ';';

    let rows = await db.query(sql, placeObj);
     
    let resultFinal = {}
    resultFinal.count = result1[0].count;
    resultFinal.rows = rows;
    console.log(resultFinal);
    return resultFinal;
 
};


// bio routes 
    const insertIntoBio = async (penName, description, userId) => {
        const sql = `insert into bio (pen_name, description, userId) VALUES (:penName, :description, :userId);`;
        return await db.query(sql, {penName: penName, description: description, userId: userId});
    };
    
    const selectBioViaId = async (userId) => {
        const sql = `select b.id as bioId, u.id as userId, b.pen_name as penName, b.description as description, u.username as username from bio as b left join users as u on b.userId = u.id where userId = :userId`;
        return await db.query(sql, {userId: userId});
    };

    const updateBioViaId = async (penName, description, id) => {
        const sql = `update bio set pen_name = :penName, description = :description where id = id`;
        return await db.query(sql, {description: description, penName: penName, id: id});
    };

    const deleteBio = async (id) => {
        const sql = 'delete from bio where id = :id';
        return await db.query(sql, {id: id});
    }

    // bio module invites
    const insertIntoInvites = async (authorId, invitedAuthor, moduleId) => {
        const sql = `insert into invites (author, author_to_invite, moduleId, accepted) values (:author, :invitedAuthor, :moduleId, 0)`;
        return await db.query(sql, {author: authorId, invitedAuthor: invitedAuthor, moduleId});
    };

    const selectInvites = async (userId) => {
        const sql = `select * from invites where author = :userId`;
        return await db.query(sql, {userId: userId});
    };

    const updateInvites = async (inviteId, accepted) => {
        const sql = `update invites set accepted = :accepted`;
        return await db.query(sql, {inviteId: inviteId, accepted: accepted});
    };

    const deleteInvite = async (inviteId) => {
        const sql = `delete from invites where id = :inviteId`;
        return await db.query(sql, {inviteId: inviteId});
    };

    // module admin invited author index
    
    const insertIntoModuleAdmins = async (moduleId, userId) => {
        const sql = `insert into module_admins (module_id, userId) values (:moduleId, :userId)`;
        return await db.query(sql, {moduleId: moduleId, userId: userId});
    };

    const deleteFromModuleAdmins = async (id) => {
        const sql = `delete from module_admins where id = :id`;
        return await db.query(sql, {id: id});
    };

    const selectFromModuleAdmins = async (moduleId) => {
        const sql = 'select * from module_admins where id = :moduleId';
        return await db.query(sql, {moduleId: moduleId});
    };

    //  admin_group_modules_index to hold modules for head author to splice where wanted
    const insertIntoAdminGroupModules = async (userId, primaryAuthor, moduleName, messageForumId, keyName, penName, joinedModuleId) => {
        const sql = 'insert into admin_group_modules_index (userId, primary_author, module_name, message_forum_id, key_name, contributor_pen_name, created, timestamp, joined_module_id) values (:userId, :primaryAuthor, :moduleName, :messageForumId, :keyName, :penName, now(), now(), joinedModuleId)'
        return await db.query(sql, {userId: userId, primaryAuthor: primaryAuthor, moduleName: moduleName, messageForumId: messageForumId, keyName: keyName, penName: penName, joinedModuleId: joinedModuleId});
    };

    const deleteFromAdminGroupModules = async (id) => {
        const sql = 'delete from admin_group_modules_index where id = :id';
        return await db.query(sql, {id: id});
    } ;

    const selectAdminGroupModuleViaId = async (id) => {
        const sql = 'select * from admin_group_modules_index where id = :id';
        return await db.query(sql, {id: id});
    };

    const selectAdminGroupModuleViaKey = async (key) => {
        const sql = 'select * from admin_group_modules_index where key = :key';
        return await db.query(sql, {key: key})
    };

    const updateAdminGroupModule =  async (adminModuleId, moduleName, messageForumId, keyName, penName, joinedModuleId) => {
        const sql = 'update admin_group_modules_index set module_name = :moduleName, message_forum_id = :messageFormumId, key_name = :keyName, contributor_pen_name = :penName, timestamp = now(), joined_module_id = :joinedModuleId';
        return await db.query(sql, {adminModuleId: adminModuleId, moduleName: moduleName, messageForumId: messageForumId, keyName: keyName, penName: penName, joinedModuleId: joinedModuleId});
    }
    
    
    
        // forum for speaking to other admins about project


    const insertIntoForum = async (adminModuleId, comment, commenterId) => {
        const sql = 'insert into module_admin_forum (admin_module_id, comment, commenter_id, up, down) values (:adminModuleId, :comment, :commenterId, 0, 0)';
        return await db.query(sql, {adminModuleId: adminModuleId, comment: comment, commenterId: commenterId});
    };

    const updateForumComment = async (id, comment) => {
        const sql = 'update module_admin_forum set comment = :comment where id = :id';
        return await db.query(sql, {id: id, comment: comment});
    };

    const deleteComment = async (id) => {
        const sql = 'delete from module_admin_forum where id - :id';
        return await db.query(sql, {id: id});    
    };
        // TO BE UPDATED TO PAGINATION WHEN THE PAGE IS MADE
    
    const selectComments = async (moduleId) => {
        const sql = 'select * from module_admin_forum where admin_module_id = :moduleId';
        return await db.query(sql, {moduleId: moduleId});
    };


    // reviews on modules
    const insertReview = async (string, userId, star) => {
        const sql = 'insert into review_table (string, uid, star, timestamp) values (:string, userId, star, now())';
        return await db.query(sql, {string: string, userId: userId, star: star});
    };

    const deleteReviewPastNuTen = async (moduleId) => {
        const sql = 'DELETE FROM review_table WHERE module_id = :moduleId id IN ( SELECT id FROM (SELECT id FROM review_table ORDER BY id DESC limit 1000 OFFSET 10) AS x);';
        return await db.query(sql, {moduleId: moduleId});
    };

    const selectReviews = async (moduleId) => {
        const sql = 'select * from review_table where module_id = :moduleId';
        return await db.query(sql, {moduleId: moduleId});
    }
    // votes

    const insertVote = async (moduleId) => {
        const sql = 'insert into votes (moduleId, up, down, timestamp) values (:moduleId, 0, 0, now())'
        return await db.query(sql, {moduleId: moduleId});
    };
    const updateUpVote = async (moduleId) => {
        const sql = 'update votes set up = up + 1 where moduleId = :moduleId';
        return await db.query(sql, {moduleId: moduleId});
    };
    const updateDownVote = async (moduleId) => {
        const sql = 'update votes set down = down + 1 where moduleId = :moduleId';
        return await db.query(sql, {moduleId: moduleId});
    };
    const selectVotes = async (moduleId) => {
        const sql = 'select * from votes where moduleId = :moduleId';
        return await db.query(sql, {moduleId: moduleId});
    };

    const determineHighestVoteOnComp = async ( competitionId) => {
        const sql = 'select (v.up - v.down) as score, v.up as up, v.down as down, m.pen_name as pen_name, m.module_name as module_name, m.key_name as key_name, m.userId as userId, m.description as description, m.genre as genre, m.competition_id as competition_id from votes as v right join module_index_table as m on v.module_id = m.id where  m.competition_id = competitionId order by score desc limit 5 offset 5';
        return await db.query(sql, { competitionId});
    };

    
    // competition index
    
    const insertCompetition = async (startDate, endDate, description, imageLocation, title, reward) => {
        const sql = 'insert into competition_index (start_date, end_date, description, image_location, title, reward) values (:startDate, :endDate, :description, :imageLocation, :title, :reward)';
        return await db.query(sql, {startDate: startDate, endDate: endDate, description: description, imageLocation: imageLocation, title: title, reward: reward});
    }
    
    const deleteCompetition = async (id) => {
        const sql = 'delete from competition_index where id = :id';
        return await db.query(sql, {id: id});
    }
    const selectCompetitions = async () => {
        const sql = 'select * from competitions_index';
        return await db.query(sql);
    }
    const updateCompetition = async (startDate, endDate, description, imageLocation, title, reward) => {
        const sql = 'update competitions_indes set start_date = : startDate, end_date = :endDate, description = :description, image_location = :imageLocation, title = :title, reward = :reward';
        return await db.query(sql, {startDate: startDate, endDate: endDate, description: description, imageLocation: imageLocation, title: title, reward: reward});
    }
    // reports on modules
    
    const insertReportType = async (type, message) => {
        const sql = 'insert into report_type (type, message) values (:type, :message)';
        return await db.query(sql, {type: type, message: message});
    }
    const selectReportTypeRows = async () => {
        const sql = 'select * from report_type';
        return await db.query(sql);
    }

    const insertReport = async (moduleId, type, reason) =>  {
        const sql = 'insert into reports (module_id, type, reason) values (:moduleId, :type, :reason)';
        return await db.query(sql, {moduleId: moduleId, type: type, reason: reason});
    }

    const countReports = async (moduleId) => {
        const sql = 'select count(*) reports where module_id = :moduleId';
        return await db.query(sql, {moduleId: moduleId});

    }

    const selectReports = async (moduleId) => {
        const sql = 'select * from reports where module_id = :moduleId';
        return await db.query(sql, {moduleId: moduleId});
    }


    // site setttings

    const updateSiteSettingsForumSwitch = async (userId, sw) => {
        const sql = 'update ssettings set forum_switch = :sw, userId = :userId';
        return await db.query(sql, {userId: userId, switch: sw})
    }
    
    const updateSiteSettingsLoginSwitch = async (userId, sw) => {
        const sql = 'update ssettings set login_switch = :sw, userId = :userId';
        return await db.query(sql, {userId: userId, switch: sw})
    }
    const selectSiteSettings = async () => {
        const sql = 'select * from ssettings';
        return await db.query(sql);
    }


export default { selectFromModuleIndexTableViaUserIdAndLetter, updateCompetition, selectCompetitions, selectSiteSettings, selectComments, updateAdminGroupModule, selectFromModuleAdmins, deleteBio, selectReviews, insertIntoUsers, fetchUserViaEmail, updateFailedAttempts, resetFailedAttempts, insertIntoModuleIndexTable, searchModuleIndexTableViaStringAndField, insertIntoAdminIndex, selectFromAdminIndexViaUserId, selectAllAdminIndexUsers, insertIntoBio, selectBioViaId, updateBioViaId, insertIntoInvites,  selectInvites, updateInvites, deleteInvite, insertIntoModuleAdmins, deleteFromModuleAdmins, insertIntoAdminGroupModules, deleteFromAdminGroupModules, selectAdminGroupModuleViaId, selectAdminGroupModuleViaKey, insertIntoForum, updateForumComment, deleteComment, insertReview, deleteReviewPastNuTen, insertVote, updateUpVote, updateDownVote,  selectVotes, determineHighestVoteOnComp, insertCompetition, deleteCompetition, insertReportType,  selectReportTypeRows, insertReport, countReports, selectReports, updateSiteSettingsForumSwitch, updateSiteSettingsLoginSwitch};