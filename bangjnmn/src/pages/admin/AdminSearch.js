import React from "react";
//import Select from 'react-select';
import { styled } from "styled-components";

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: center; 
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
`;

const AdminSearch = () => {

    // const options = [
    //   { value: 'option1', label: 'Option 1' },
    //   { value: 'option2', label: 'Option 2' },
    //   { value: 'option3', label: 'Option 3' }
    // ];

    // const [selectedOption, setSelectedOption] = useState(null);

    // const handleChange = (selected) => {
    //   setSelectedOption(selected);
    // };

    return (
        <Div>
            <h1>AdminSearch</h1>
            {/* <Select
              options={options}
              value={selectedOption}
              onChange={handleChange}
            />
            {selectedOption && (
              <p>You have selected: {selectedOption.label}</p>
            )} */}
        </Div>
    )
}

export default AdminSearch;
