import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Box, Typography, Link, Container } from "@mui/material";

const Layout = ({ children }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            height="100vh"
            width="100vw"
            sx={{ backgroundColor: "#f5f5f5" }}
        >
            {/* Header */}
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                height="80px"
                sx={{
                    backgroundColor: "#0099ff", // Darker blue for a more professional look
                    padding: "0 2rem",
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                    color: 'white',
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    <Link href="/" sx={{ color: "white", textDecoration: "none" }}>MechaniCare</Link>
                </Typography>

                <Box display="flex" alignItems="center" gap={3}>
                    <Typography variant="h6">
                        <Link href="/dashboard" sx={{ color: "white", textDecoration: "none", '&:hover': { textDecoration: 'underline' } }}>Dashboard</Link>
                    </Typography>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Link href="/chat" sx={{ color: "white", textDecoration: "none", '&:hover': { textDecoration: 'underline' } }}>AI chatbot</Link>
                    </Typography>

                    {/* User Button for Sign Out */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <UserButton />
                    </Box>
                </Box>
            </Box>

            {/* Content Area */}
            <Box
                flex={1}
                display="flex"
                flexDirection="column"
                sx={{ padding: "2rem" }}
            >
                <Container maxWidth="lg">
                    {children}
                </Container>
            </Box>
        </Box>
    )
}

const Loading = () => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            sx={{ backgroundColor: "#f5f5f5" }}
        >
            <Typography variant="h2">Loading...</Typography>
        </Box>
    )
}

export { Layout, Loading };