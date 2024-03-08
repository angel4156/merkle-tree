import { Fragment } from 'react'
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  FormControl,
  Button
} from 'react-bootstrap'

const Home = ({ wallets, addingWallet, setAddingWallet, wallet, owner, currentTime, onAdd, connectWallet, getTime }) => {
  const date = new Date
  return <Container>
    <Row>
      <Col xs={0} sm={1} md={2} lg={3} />
      <Col xs={12} sm={10} md={8} lg={6}>
        {
          !!wallet ? <div>Wallet:{wallet}<br /></div> : <div className='d-grid gap-2 mb-3'>
            <Button variant='primary' onClick={e => connectWallet()}>
              Connect Wallet
            </Button>
          </div>
        }
        <div className='d-grid gap-2 mb-3'>
          <Button variant='primary' onClick={e => getTime()}>
            Get Time
          </Button>
        </div>
        Current Time:{currentTime}<br />
        {
          !!wallet && owner === wallet ? <Fragment>
            <h1 className='text-center'>Whitelist Wallets</h1>
            <div style={{ overflow: 'auto', maxHeight: '300px' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Wallet</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    wallets.map(wallet => <tr key={wallet._id}>
                      <td>{wallet.wallet}</td>
                    </tr>)
                  }
                </tbody>
              </table>
            </div>
            <Form noValidate>
              <Form.Label htmlFor='basic-url'>Wallet Address</Form.Label>
              <InputGroup className='mb-3'>
                <FormControl name='addingWallet' value={addingWallet} onChange={e => setAddingWallet(e.target.value)} />
              </InputGroup>
              <div className='d-grid gap-2 mb-3'>
                <Button variant='primary' onClick={e => onAdd()}>
                  Add
                </Button>
              </div>
            </Form>
          </Fragment> : ''
        }
      </Col>
    </Row>
  </Container>
}

export default Home