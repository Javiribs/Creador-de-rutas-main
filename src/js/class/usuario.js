// @ts-check

export class Usuario {
    id;
    name;
    country;   
    email;
    password;
    birthdate;
    /**
     * @param {string} id 
     * @param {string} name 
     * @param {string} country 
     * @param {string} email 
     * @param {string} password 
     * @param {string} birthdate 
     */
    constructor(id, name, country, email, password, birthdate) {
      this.id = id; // El id se asigna manualmente
      this.name = name;
      this.country = country;
      this.email = email;
      this.password = password;
      this.birthdate = birthdate;
    }
  }