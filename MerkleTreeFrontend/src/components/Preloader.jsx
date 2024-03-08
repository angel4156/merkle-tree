import {
  Spinner
} from 'react-bootstrap'

const Preloader = () => <div className='preloader'>
  <Spinner
    animation='border'
    variant='primary'
    className='preloader-spinner'
  />
</div>

export default Preloader