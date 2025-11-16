import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        children: [
            // {index:true, element: <Feed />},
            // {path: "/explore", element: <Explore/>},
            // {path:"/profile", element:<Profile />},
            // {path:"/profile/:username", element:<Profile />}
        ],
    },
])

export default router
