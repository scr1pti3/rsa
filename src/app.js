import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import bigInt from 'big-integer';
import {
  Table,
  Button,
  Modal,
  ModalBody,
  Pagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap';
import {generatePrime, genRowMap} from './rsa'
import 'bootstrap/dist/css/bootstrap.min.css';

function getLastDigit(str) {
  return str.slice(-1);
}

function IsSelectedPrime(prime) {
//This function does not check if the parameter is prime, it is assume its prime
  let lastDigit = prime.slice(-1);
  if(lastDigit === '1' || lastDigit === '3' || lastDigit === '7' || lastDigit === '9')
    return true;
}

function PrimeTable(props) {
  const [modal, setModal] = useState(false);
  const [tableRows, setTableRows] = useState(null);
  const [max, setMax] = useState(1000);
  const [min, setMin] = useState(0);

  function generateTableRow() {
    const primeArray = generatePrime(min,max);
    const primeMap = primeArray.filter(prime => IsSelectedPrime(prime.toString()));
    const rowMap = genRowMap(min,max);

    const _tableRows = rowMap.map(row => {
      const primeRows = primeMap.filter(prime => prime.gt(row) && prime.lt(bigInt(row).plus(10)));
      const _primeRows = [null,null,null,null];
      for (let i=0; i < 4; i++) {
        if(primeRows[i] !== undefined) {
          //All of the primeRows are of BigInt, it needs to be stored as string or error will occured
          let lastDigit = getLastDigit(primeRows[i].toString());
          if(lastDigit === '1') _primeRows[0] = primeRows[i].toString();
          else if (lastDigit === '3') _primeRows[1] = primeRows[i].toString();
          else if (lastDigit === '7') _primeRows[2] = primeRows[i].toString();
          else if (lastDigit === '9') _primeRows[3] = primeRows[i].toString();
        }
      }

      const primetd = _primeRows.map(prime => (
        <td>{prime}</td>
      ));

      return (
        <tr >
          <th scope="row">{row}</th>
          {primetd}
        </tr>
      );
    });
    return _tableRows;
  }

  const handleClick = () => {
    setMin(bigInt.zero);
    setMax(bigInt('1000'));

    setTableRows(generateTableRow())
    setValue(bigInt(event.target.value));
    setModal(true);
  }

  const handleKeyDown = e => {
    let searchval = bigInt(e.target.value);

    if(e.keyCode === 13) {
        if(searchval.lt(1000))
          setMin(bigInt.zero);
        else
          setMin(searchval.minus(1000));
        setMax(searchval);
    }

  }

  const handleToggle = () => {
    setModal(!modal);
  }

  const paginationNext = () => {
    setMin(max);
    setMax(max.plus(1000));
  }
  const paginationPrev = () => {
    if(min.gt(0)){
      setMin(max.minus(2000));
      setMax(max.minus(1000));
    }
  }

  useEffect(() =>{
      setTableRows(generateTableRow());
  }, [min,max,modal])

  return(
    <div>
      <Button onClick={handleToggle}>Mapped Tables</Button>
      <Modal size="lg" isOpen={modal} toggle={handleToggle}>
        <ModalBody>
          <Table bordered>
            <thead>
              <tr>
                <th>#</th>
                <th>1</th>
                <th>3</th>
                <th>7</th>
                <th>9</th>
              </tr>
            </thead>
            <tbody>
              {tableRows}
            </tbody>
          </Table>
          <Pagination size="sm">
            <PaginationItem>
              <PaginationLink previous onClick={paginationPrev}/>
            </PaginationItem>
            <PaginationItem>
              <input type="text" onKeyDown={handleKeyDown}/>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink next onClick={paginationNext}/>
            </PaginationItem>
          </Pagination>
        </ModalBody>
      </Modal>
    </div>
  )
}
ReactDOM.render(
  <div>
    <PrimeTable/>
  </div>, document.getElementById('root')
)
console.log(bigInt(5));
