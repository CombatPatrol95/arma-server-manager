package cz.forgottenempire.servermanager.steamcmd;

import cz.forgottenempire.servermanager.common.ServerType;
import cz.forgottenempire.servermanager.workshop.WorkshopMod;
import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SteamCmdJob {

    private WorkshopMod relatedWorkshopMod;
    private ServerType relatedServer;
    private ErrorStatus errorStatus;
    @NotNull
    private SteamCmdParameters steamCmdParameters;

    public SteamCmdJob(ServerType relatedServer, SteamCmdParameters steamCmdParameters) {
        this.relatedServer = relatedServer;
        this.steamCmdParameters = steamCmdParameters;
    }

    public SteamCmdJob(WorkshopMod relatedWorkshopMod, SteamCmdParameters steamCmdParameters) {
        this.relatedWorkshopMod = relatedWorkshopMod;
        this.steamCmdParameters = steamCmdParameters;
    }
}
