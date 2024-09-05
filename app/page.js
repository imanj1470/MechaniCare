"use client"
import { Layout } from "./components/header.js"
import {AddCarModal} from "./components/add_car_modal.js"

import { Box} from "@mui/material"

export default function Home() {
  return (
    <Layout>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">


        <AddCarModal/>

      </Box>
    </Layout>
  )
}