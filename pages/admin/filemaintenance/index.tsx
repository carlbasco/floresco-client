// import Head from 'next/head'
// import Link from 'next/link'
// import { SyntheticEvent, useState } from 'react'
// import { TabContext, TabList, TabPanel } from '@material-ui/lab'
// import { Box, Breadcrumbs, Container, Tab, Typography } from '@material-ui/core'

import { FileMaintenance } from "@components"

// import {
//   TablePackage,
//   TableCategory,
//   TableProduct,
//   TableChapel,
// } from '@components'
// import { AdminLayout } from '@layouts'
// import useStyles from '@styles/pages/services'

// const Services = ({ tabNumber }: iProps) => {
//   const [selectedTab, setSelectedTab] = useState(tabNumber)

//   const handleChange = (e: SyntheticEvent, newValue: string) => {
//     setSelectedTab(newValue)
//   }

//   const classes = useStyles()
//   return (
//     <>
//       <Head>
//         <title>File Maintenance</title>
//         <meta name="viewport" content="initial-scale=1.0, width=device-width" />
//       </Head>
//       <AdminLayout index={3}>
//         <div>
//           <Breadcrumbs separator=">">
//             <Link href="/admin">
//               <a style={{ textDecoration: 'none' }}>
//                 <Typography
//                   className={classes.breadcrumbLink}
//                   color="textPrimary"
//                   variant="body1"
//                 >
//                   Dashboard
//                 </Typography>
//               </a>
//             </Link>
//             <Typography color="textSecondary" variant="body1">
//               Services
//             </Typography>
//           </Breadcrumbs>
//         </div>
//         <TabContext value={selectedTab}>
//           <Box
//             sx={{ borderBottom: 1, borderColor: 'divider', marginTop: '1em' }}
//           >
//             <TabList onChange={handleChange}>
//               <Tab label="Category" value="1" />
//               <Tab label="Product" value="2" />
//               <Tab label="Package" value="3" />
//               <Tab label="Chapel" value="4" />
//             </TabList>
//           </Box>
//           <Container maxWidth="lg" className={classes.container}>
//             <TabPanel value="1" className={classes.tabPanel}>
//               <TableCategory />
//             </TabPanel>
//             <TabPanel value="2" className={classes.tabPanel}>
//               <TableProduct />
//             </TabPanel>
//             <TabPanel value="3" className={classes.tabPanel}>
//               <TablePackage />
//             </TabPanel>
//             <TabPanel value="4" className={classes.tabPanel}>
//               <TableChapel />
//             </TabPanel>
//           </Container>
//         </TabContext>
//       </AdminLayout>
//     </>
//   )
// }

// interface iProps {
//   tabNumber: string
// }
// export default Services


const Category = () => {
  return (
    <>
      <FileMaintenance tabNumber="1" /> 
    </>
  )
}

export default Category
