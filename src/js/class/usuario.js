// @ts-check

export class Usuario {
    _id 
    name
    lastname
    birthdate
    country   
    email
    password
    token
    /**
     * @param {string} _id 
     * @param {string} name 
     * @param {string=} [lastname]
     * @param {string=} [birthdate] 
     * @param {string=} [country] 
     * @param {string} email 
     * @param {string=} [password] 
     * @param {string=} [lastname]
     * @param {string=} [token]
     */
    constructor(_id, name, email, lastname, birthdate, country, password, token) {
      this._id = _id; 
      this.name = name;
      this.lastname = lastname;
      this.birthdate = birthdate;
      this.country = country;
      this.email = email;
      this.password = password;
      this.token = token;      
    }
  }