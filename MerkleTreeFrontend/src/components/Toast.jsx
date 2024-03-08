import {
  ToastContainer,
  Toast
} from 'react-bootstrap'

const MyToast = ({ title, content, hideToast }) =>
  <ToastContainer position='top-end' className='p-3'>
    <Toast onClose={() => hideToast()} delay={3000} autohide>
      <Toast.Header>
        <img src='holder.js/20x20?text=%20' className='rounded me-2' alt='' />
        <strong className='me-auto'>{title}</strong>
        <small className='text-muted'>just now</small>
      </Toast.Header>
      <Toast.Body>{content}</Toast.Body>
    </Toast>
  </ToastContainer>

export default MyToast