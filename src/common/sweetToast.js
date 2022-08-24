
import Swal from 'sweetalert2'
// Toast config
const Toaster = {
  success(message, variant) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: variant,
      title: message,
      showConfirmButton: true,
      timerProgressBar: true,
      timer: 5000
    })
  },
  error(message, variant) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: variant,
      title: message,
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 5000
    })
  },
  confirmation() {
    return Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete it!",
    })
  },
  cancelButtonConfirmation() {
    return Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes, Cancel it!",
    })
  },
  provideAgentServiceConfirmation() {
    return Swal.fire({
      title: "",
      text: "Provide agent services to other organisations",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes",
    })
  },
  unmergeButtonConfirmation() {
    return Swal.fire({
      title: "Are you sure?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes, Unlink it!",
    })
  },
  customConfirmation(message, variant) {
    return Swal.fire({
      title: "<h3 style='font-weight: 600'>" + message +" </h3>",
      showCancelButton: true,
      icon: variant,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Continue",
    })
  }
}


export default Toaster;