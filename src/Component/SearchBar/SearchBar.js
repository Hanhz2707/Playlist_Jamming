import React, {useState} from "react";
import styles from './SearchBar.module.css';

function SearchBar (props) {
  const [term, setTerm] = useState('');

  const passTerm = () => {
    props.onSearch(term);
  };

  const handeleTermChange = ({target}) => {
    setTerm(target.value);
  };
    return (
        <div className={styles.SearchBar}>
        <input
          placeholder="Enter A Song, Album, or Artist"
          onChange={handeleTermChange}
        />
        <button className={styles.SearchButton} onClick={passTerm} >
          SEARCH
        </button>
      </div>
        );
}

export default SearchBar;