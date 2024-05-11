import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Student from './components/Student';
import AddStudent from './components/AddStudent';
import UpdateStudent from './components/UpdateStudent';
import Score from './components/Score';
import AddScore from './components/AddScore';
import UpdateScore from './components/UpdateScore';
import VisualizeScore from './components/VisualizeScore';
import Login from './components/Login';
import Register from './components/Register';
import AdminLogin from './components/AdminLogin';
import AdminHome from './components/AdminHome';
import UpdateTeacher from './components/UpdateTeacher';
import AdminUpdateStudent from './components/AdminUpdateStudent'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/:teacherId/' element={<Student />}></Route>
        <Route path='/:teacherId/addstudent' element={<AddStudent />}></Route>
        <Route path='/:teacherId/updatestudent/:studentId' element={<UpdateStudent />}></Route>

        <Route path='/:teacherId/getscore/:studentId' element={<Score />}></Route>
        <Route path='/:teacherId/addscore/:studentId' element={<AddScore />}></Route>
        <Route path='/:teacherId/updatescore/:studentId/:scoreId' element={<UpdateScore />}></Route>
        <Route path='/:teacherId/visualizescore/:studentId' element={<VisualizeScore />}></Route>

        <Route path='/admin/' element={<AdminLogin />}></Route>
        <Route path='/admin/view' element={<AdminHome />}></Route>
        <Route path='/admin/updateteacher/:teacherId' element={<UpdateTeacher />}></Route>
        {/* <Route path='/admin/addstudent' element={<AddStudent />}></Route> */}
        <Route path='/admin/:teacherId/updatestudent/:studentId' element={<AdminUpdateStudent />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;