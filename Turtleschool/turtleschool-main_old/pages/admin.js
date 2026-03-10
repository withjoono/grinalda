import axios from 'axios';
import {useState} from 'react';
import pool from '../lib/pool';
import styles from './admin.module.css';

const sendPush = (rows, title, body, url) => {
  rows.map(async r => {
    await fetch('/api/notification', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        push_token: r.push_token,
        title: title,
        message: body,
        url: url,
      }),
    });
  });
};

const Admin = ({rows}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [log, setLog] = useState(false);
  const login = async () => {
    const res = await axios.post('/api/admin', {}, {headers: {user: user, pass: pass}});
    if (res.status == '200') setLog(true);
  };

  const loginform = (
    <div className={styles.admin}>
      <input
        name="user"
        onChange={e => {
          setUser(e.target.value);
        }}
      />
      <input
        name="pass"
        onChange={e => {
          setPass(e.target.value);
        }}
      />
      <button
        onClick={e => {
          login(user, pass);
        }}
      >
        login{' '}
      </button>
    </div>
  );

  if (log) {
    return (
      <div className={styles.admin}>
        <input
          name="title"
          onChange={e => {
            setTitle(e.target.value);
          }}
          value={title}
        />
        <input
          name="message"
          onChange={e => {
            setBody(e.target.value);
          }}
          value={body}
        />
        <input
          name="url"
          onChange={e => {
            setUrl(e.target.value);
          }}
        />
        <button
          onClick={e => {
            sendPush(rows, title, body, url);
          }}
        >
          push me!
        </button>
      </div>
    );
  } else return loginform;
};

export default Admin;

export async function getServerSideProps() {
  const {rows} = await pool.query(
    `select push_token from members where (push_token is not null and push_token <> '')`,
  );
  return {props: {rows: rows}};
}
