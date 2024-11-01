import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Auth from './pages/Auth'
import { default as Login, default as Register } from './pages/Auth/Login'
import Board from './pages/Boards/_id'
import Boards from './pages/Boards/Boards'
import ListWorkSpace from './pages/Boards/ListWorkSpace/ListWorkSpace'
import WorkSpace from './pages/Boards/ListWorkSpace/WorkSpace/WorkSpace'
import Template from './pages/Boards/Template/Template'
import RootLayout from './pages/RootLayout/RootLayout'

function App() {
  return (
    <>
      <BrowserRouter future={{ v7_startTransition: true }}>
        <Routes>
          {/*react router dom */}
          <Route path="/" element={<Navigate to="/user" />} />
          <Route path="/user" element={<Auth />}>
            <Route path="login" element={<Login />} />
            <Route path="sign-up" element={<Register />} />
          </Route>

          {/*Boards list */}
          <Route path="/root" element={<RootLayout />}>
            <Route path="workspaces" element={<Boards />}>
              <Route path="list-workspaces" element={<ListWorkSpace />} />
              <Route path="template" element={<Template />} />
              <Route path=":workspaceId" element={<WorkSpace />} />
            </Route>
            <Route path="boards/:boardId" element={<Board />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
