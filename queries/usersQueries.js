const getAllUsersQuery = "SELECT * FROM users";
const getUserByIdQuery = "SELECT * FROM users WHERE id = $1";
const checkUserExistQuery = "SELECT * FROM users WHERE email = $1";
const checkUserSocialQuery = "SELECT * FROM users WHERE social_login = $1";
const checkEmailTokenQuery = "SELECT * FROM tokens WHERE email_token = $1";
const checkTokenQuery = "SELECT * FROM tokens WHERE token = $1 ORDER BY created_at";
const checkEmailSocialQuery = "SELECT * FROM social WHERE social_provider_email = $1";
const checkUidSocialQuery = "SELECT * FROM social WHERE social_provider_uid = $1";
const registerQuery = "INSERT INTO users (first_name, last_name, email, password,image) VALUES ($1, $2, $3, $4, $5)";
const registerwithSocialQuery = "INSERT INTO users (first_name,last_name, email, password,image,phone, is_active, is_verified, social_login) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
const registerSocialQuery = "INSERT INTO social (id, social_provider, social_provider_uid, social_provider_name, social_provider_email) VALUES ($1, $2, $3, $4, $5)";

const tokenRegQuery = "INSERT INTO tokens ( token_type, id, token, token_name, token_desc, created_at) VALUES ($1, $2, $3, $4, $5, $6)";
const deleteUserQuery = "DELETE FROM users WHERE id = $1";
const deleteTokenQuery = "DELETE FROM tokens WHERE id = $1";
const deleteAddressQuery = "DELETE FROM address WHERE id = $1";
const deleteSocialQuery = "DELETE FROM social WHERE id = $1";
const updateUserQuery = "UPDATE users SET first_name=$1 , image=$2, phone=$3, email=$4, last_name=$5 WHERE id = $6";
const updatePwdQuery = "UPDATE users SET password=$1 WHERE id = $2";
const updateTokenQuery = "UPDATE tokens SET email_token=$1, verify_date=$2 WHERE token_id = $3";
const updateResPwdTokenQuery = "UPDATE tokens SET resetpassword_token=$1, resetpassword_date=$2 WHERE token_id = $3";
const updateSocialQuery = "UPDATE social SET social_provider=$1 WHERE id = $3";
const updateUserTokenQuery = "UPDATE users SET is_active=$1, is_verified=$2 WHERE id = $3";

//address
const getAddressByUserIdQuery = "SELECT * FROM address WHERE id = $1";
const getAddressByIdQuery = "SELECT * FROM address WHERE address_id = $1";
const addAddressQuery = "INSERT INTO address (id,address1, address2, address3,address4,address5,address6,address7,address8,address9,address10,postcode,city,suburb,country) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)";
const updateAddressByIdQuery ="UPDATE address SET address1=$1, address2=$2, address3=$3,address4=$4,address5=$5,address6=$6,address7=$7,address8=$8,address9=$9,address10=$10,postcode=$11,city=$12,suburb=$13,country=$14,is_default=$15,status=$16 WHERE address_id = $17";


//sql injection issues
//deactivate
module.exports = { addAddressQuery,deleteAddressQuery,
    updateAddressByIdQuery, getAddressByIdQuery, getAddressByUserIdQuery,
    updateUserTokenQuery, updateSocialQuery, updateResPwdTokenQuery,
    checkUserSocialQuery,checkTokenQuery,updatePwdQuery,
    registerSocialQuery, registerwithSocialQuery,
    checkEmailSocialQuery, checkUidSocialQuery, deleteSocialQuery,
     updateTokenQuery, deleteTokenQuery, 
     tokenRegQuery, checkEmailTokenQuery, 
     getAllUsersQuery, getUserByIdQuery,
     checkUserExistQuery, registerQuery,
     deleteUserQuery, updateUserQuery
    }