import './App.css';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { makeErrors, randomNumber, extractData} from './Functions/ErrorHandling';
const { useState, useEffect } = React;

function App() {
  const [users, setUsers] = useState(null);
  const [errors, setErrors] = useState('0');
  const [region, setRegion] = useState('');
  const [seed, setSeed] = useState('20');

  async function getAPI(regionField, seedField, errorField , scrolled) {
    const fetchedData = await fetch(
      `https://randomuser.me/api/?results=${seedField}&inc=name,location,phone&nat=${regionField}`
    );
    const jsonData = await fetchedData.json();
    let tempUsers = extractData(jsonData.results);
    let usersWithErrors = indexUsers(makeErrors(tempUsers, parseFloat(errorField)));
    if (scrolled) {
      setUsers((prevValue) =>
      [...prevValue, ...usersWithErrors].map((user, index = 1) => {
        return { ...user, id: index + 1 };
      })
    );
    } else {
      setUsers(usersWithErrors);
    }
  }

  useEffect(() => {
    if(region !== ''){
      getAPI(region, seed, errors)}
  }, [errors, region, seed]);

  function indexUsers(data) {
    let indexedData = data.map((user, index) =>
      Object.assign({}, user, { id: index + 1 })
    );
    return indexedData;
  }

  function handleChange(e) {
    if (e.target.name === 'nat') {
      setRegion(e.target.value);
    } else if (e.target.name === 'seedValue') {
      setSeed(e.target.value);
    } else if (e.target.name === 'points' || e.target.name === 'higherPoints') {
      setErrors(e.target.value);
      if (e.target.value > 1000) {
        setErrors('1000');
      }
    }
  };

  function randomSeed(){
    let possibleRegions = ['ua', 'us', 'de'];
    getAPI(possibleRegions[randomNumber(possibleRegions.length)], randomNumber(100), randomNumber(1000));
  };



  return (
    <>
      <label htmlFor="nat">Choose the nationality:</label>
      <select id="nat" name="nat" onChange={handleChange}>
        <option value=""></option>
        <option value="ua">Ukraine</option>
        <option value="us">United States</option>
        <option value="de">Deutschland</option>
      </select>
      <div>
        <label htmlFor="points">Number of Errors</label>
        <input
          type="range"
          id="points"
          name="points"
          min="0"
          max="1"
          step="0.1"
          onChange={handleChange}
          value={errors}
        ></input>
        <input
          id="higherPoints"
          name="higherPoints"
          type="number"
          max="1000"
          onChange={handleChange}
          value={errors}
          placeholder="max value is 1000"
        ></input>
      </div>
      <div>
        <label htmlFor="seedValue">Seed</label>
        <input
          id="seedValue"
          name="seedValue"
          type="number"
          onChange={handleChange}
          value={seed}
        ></input>
        <button onClick={randomSeed}>Get Random</button>
      </div>
      {users && (
        <InfiniteScroll
          dataLength={users.length}
          next={() => getAPI(region, '10',errors, true)}
          hasMore={true}
          loader={<h4>Loading...</h4>}
        >
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Identifier</th>
                <th>Name</th>
                <th>Adress</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.title} </td>
                  <td>
                    {user.first} {user.last}
                  </td>
                  <td>
                    {user.country} {user.state}{' '}
                    {user.city} {user.postcode}{' '}
                    {user.name} {user.number}
                  </td>
                  <td>{user.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      )}
    </>
  );
}

export default App;
