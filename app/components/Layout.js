
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Box, Typography, Link } from "@mui/material";

const Layout = ({ children }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            height="100vh"
            width="100vw"
            sx={{ backgroundColor: "#f5f5f5", position: "relative" }}
        >
            {/* Header */}
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                height="70px"
                sx={{ backgroundColor: "lightblue", padding: "0 2rem" }}
            >
                <Typography variant="h4" color="black">
                <Link href="/" style={{ color: "black", textDecoration: "none" }}>MechaniCare</Link>
                </Typography>

                <Box display="flex" gap={3}>
                    <Typography variant="h6" color="black">
                        <Link style={{ color: "black", textDecoration: "none" }} href="/dashboard">Dashboard</Link>
                    </Typography>
                    <Typography variant="h6" color="black">
                        AI Chatbot
                    </Typography>

                    {/* User Button for Sign Out */}
                    <UserButton />
                </Box>
            </Box>

            {/* Content Area */}
            <Box
                flex={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ padding: "2rem" }}
            >
                {children}
            </Box>
        </Box>
    )
}

const Loading = () => {
return(
    <Box display="flex" justifyContent="center" alignItems="center">
<Typography variant="h2">Loading...</Typography>
    </Box>
)
}

export { Layout , Loading};
