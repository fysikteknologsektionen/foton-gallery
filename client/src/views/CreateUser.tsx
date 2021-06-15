import axios from 'axios';

export function CreateUser () {

  async function handleSubmit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const jsonData = Object.fromEntries(formData.entries());
    jsonData.isAdmin = 'isAdmin' in jsonData ? 'true' : 'false';
    await axios.post('/api/user', jsonData);
  }

  return (
    <>
      <h1 className="display-5">Skapa ny användare</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-floating mb-3">
          <input className="form-control" id="input-email" type="email" required name="email" placeholder="E-postadress" />
          <label htmlFor="input-email">E-postadress</label>
        </div>
        <div className="form-floating mb-3">
          <input className="form-control" id="input-password" type="password" required name="password" placeholder="Lösenord" />
          <label htmlFor="input-password">Lösenord</label>
        </div>
        <div className="form-check form-switch mb-3">
          <input className="form-check-input" id="input-admin" type="checkbox" name="isAdmin" />
          <label className="form-check-label" htmlFor="input-admin">Administratör</label>
        </div>
        <button className="btn btn-outline-primary" type="submit">Skapa</button>
      </form>
    </>
  );
}