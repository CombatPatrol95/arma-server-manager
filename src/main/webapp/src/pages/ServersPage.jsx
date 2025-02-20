import {deleteServer, getServers, restartServer, startServer, stopServer} from "../services/serversService"
import {useEffect, useState} from "react";
import {useInterval} from "../hooks/use-interval";
import ServerListEntry from "../components/servers/ServerListEntry";
import NewServerButton from "../components/servers/NewServerButton";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import TableBody from "@mui/material/TableBody";
import {toast} from "material-react-toastify";
import ConfirmationDialog from "../UI/ConfirmationDialog";
import ServerLogs from "../components/servers/ServerLogs";

const ServersPage = () => {
    const [servers, setServers] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [serverToDelete, setServerToDelete] = useState({});
    const [logServerId, setLogServerId] = useState();
    const [isLogOpen, setIsLogOpen] = useState(false);

    useEffect(() => {
        fetchServers()
    }, [])

    useInterval(async () => {
        fetchServers();
    }, 2000);

    const fetchServers = async () => {
        const {data: servers} = await getServers();
        setServers(servers.servers);
    }

    const isServerWithSamePortRunning = server => {
        const activeServerWithSamePort = servers.filter(s => s !== server)
            .filter(s => s.instanceInfo && s.instanceInfo.alive)
            .filter(s => s.port === server.port || s.queryPort === server.queryPort);
        if (activeServerWithSamePort[0]) {
            return activeServerWithSamePort[0];
        }
        return null;
    }

    const handleStartServer = async id => {
        const newServers = [...servers];
        const server = newServers.find(s => s.id === id);
        server.instanceInfo = {
            alive: true
        }
        setServers(newServers);
        await startServer(id);
    };

    const handleStopServer = async id => {
        const newServers = [...servers];
        const server = newServers.find(s => s.id === id);
        server.instanceInfo = {
            alive: false
        }
        setServers(newServers);
        await stopServer(id);
    };

    const handleRestartServer = async id => {
        const newServers = [...servers];
        const server = newServers.find(s => s.id === id);
        server.instanceInfo = {
            alive: true
        }
        setServers(newServers);
        await restartServer(id);
    };

    const handleDeleteServerClicked = server => {
        setServerToDelete(server);
        setDeleteDialogOpen(true);
    }

    const handleDeleteServer = async () => {
        setServers(prevState => [...prevState].filter(server => server.id !== serverToDelete.id));
        await deleteServer(serverToDelete.id);
        toast.success(`Server '${serverToDelete.name}' successfully deleted`);
        setServerToDelete({});
        setDeleteDialogOpen(false);
    }

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setServerToDelete({});
    }

    const handleOpenLogs = serverId => {
        setIsLogOpen(true);
        setLogServerId(serverId);
    }

    const handleCloseLogs = () => {
        setIsLogOpen(false);
    }

    return (
        <>
            <NewServerButton/>
            {isLogOpen && <ServerLogs onClose={handleCloseLogs} serverId={logServerId}/>}
            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        {servers.map(server =>
                            <ServerListEntry key={server.id}
                                             server={server}
                                             onStartServer={handleStartServer}
                                             onStopServer={handleStopServer}
                                             onRestartServer={handleRestartServer}
                                             onOpenLogs={handleOpenLogs}
                                             onDeleteServer={() => handleDeleteServerClicked(server)}
                                             serverWithSamePortRunning={isServerWithSamePortRunning(server)}
                            />
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <ConfirmationDialog
                open={deleteDialogOpen} title={`Delete server '${serverToDelete.name}'?`}
                description={"Deleting the server will cause all of its configuration to be permanently lost."}
                onConfirm={handleDeleteServer} onClose={handleDeleteDialogClose} actionLabel="Delete"
            />
        </>
    );
}

export default ServersPage;