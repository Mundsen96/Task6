import './App.css';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  makeErrors,
  randomNumber,
  extractData,
} from './Functions/ErrorHandling';
import { CSVLink } from 'react-csv';
const { useState, useEffect } = React;

function App() {
  const [users, setUsers] = useState(null);
  const [errors, setErrors] = useState('0');
  const [region, setRegion] = useState('');
  const [seed, setSeed] = useState('20');

  async function getAPI(regionField, seedField, errorField, scrolled) {
    const fetchedData = await fetch(
      `https://randomuser.me/api/?results=${seedField}&inc=name,location,phone&nat=${regionField}`
    );
    const jsonData = await fetchedData.json();
    let tempUsers = extractData(jsonData.results);
    let usersWithErrors = indexUsers(
      makeErrors(tempUsers, parseFloat(errorField))
    );
    if (scrolled) {
      setUsers((prevValue) =>
        [...prevValue, ...usersWithErrors].map((user, index = 1) => {
          return { ...user, id: index + 1 };
        })
      );
    } else {
      setUsers(usersWithErrors);
      return usersWithErrors;
    }
  }

  useEffect(() => {
    if (region !== '') {
      getAPI(region, '20', errors);
    }
  }, [errors, region]);

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
  }

  function maxCurrentLocalStorage(){
    let currentSearches = Object.entries(localStorage).sort().slice(0, -2);
    let maxCurrentValue =
      currentSearches.length === 0
        ? 0
        : Math.max(...currentSearches.map((o) => parseInt(o[0])));
    return maxCurrentValue
  }

  function saveToLocalStorage(key, extraData){
    let possibleRegions = ['ua', 'us', 'de'];
    getAPI(
      possibleRegions[randomNumber(possibleRegions.length)],
      key,
      randomNumber(1000)
    )
      .then((res) => extraData ? localStorage.setItem(seed, JSON.stringify([...extraData, ...res])) :localStorage.setItem(key, JSON.stringify(res)))
      .catch((err) => console.log(err));
  }

  function getFromLocalStorage(key){
    return JSON.parse(localStorage.getItem(key));
  }

  function randomSeed() {
    if (localStorage.getItem(seed)) {
      setUsers(getFromLocalStorage(seed));
    } else if (seed < maxCurrentLocalStorage()) {
      setUsers(
        getFromLocalStorage(maxCurrentLocalStorage()).slice(0, seed)
      );
    } else if (!localStorage.getItem(seed)) {
      saveToLocalStorage(seed);
    } else if (seed > maxCurrentLocalStorage()) {
      let currentLocalStorage = JSON.parse(
        localStorage.getItem(maxCurrentLocalStorage())
      );
      let amountToFetch = parseInt(seed) - maxCurrentLocalStorage();
      saveToLocalStorage(amountToFetch, currentLocalStorage);
    }
  }

  const headers = [
    { label: '#', key: 'id' },
    { label: 'Identifier', key: 'title' },
    { label: 'Name', key: 'name' },
    { label: 'Country', key: 'country' },
    { label: 'State', key: 'state' },
    { label: 'City', key: 'city' },
    { label: 'Address', key: 'country' },
    { label: 'Phone', key: 'phone' },
  ];

  const csvReport = {
    data: users,
    headers: headers,
    filename: 'Task6.csv',
  };

  return (
    <>
      <div className="controller">
        <div className="input-container">
          <label htmlFor="nat">Choose the nationality:</label>
          <select id="nat" name="nat" onChange={handleChange}>
            <option value=""></option>
            <option value="ua">Ukraine</option>
            <option value="us">United States</option>
            <option value="de">Deutschland</option>
          </select>
        </div>
        <div className="input-container">
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
        <div className="input-container">
          <label htmlFor="seedValue">Seed</label>
          <input
            id="seedValue"
            name="seedValue"
            type="number"
            onChange={handleChange}
            value={seed}
          ></input>
        <div className='button-container'>
          <button onClick={randomSeed}>Get Random</button>
          <br />
          {users && <CSVLink {...csvReport}>Export to CSV</CSVLink>}
        </div>
        </div>
      </div>
      {users && (
        <InfiniteScroll
          dataLength={users.length}
          next={() => getAPI(region, '10', errors, true)}
          hasMore={true}
          loader={<h4>Loading...</h4>}
        >
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Identifier</th>
                <th>Name</th>
                <th>Country</th>
                <th>State</th>
                <th>City</th>
                <th>Address</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.title} </td>
                  <td>{user.name}</td>
                  <td>{user.country}</td>
                  <td>{user.state}</td>
                  <td>{user.city}</td>
                  <td>{user.address}</td>
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
