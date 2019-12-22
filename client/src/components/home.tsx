import React from "react";
import WalletConnect from "@walletconnect/browser";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
import { IEvents } from "../Model/eventData.model";
import EventService from "../service/getEventsDataService";
import Button from "@material-ui/core/Button";
import { RouteComponentProps } from "react-router";
import TicketBuyingModal from "./ticketBuyingModal";
import Typography from "@material-ui/core/Typography";
import AppBarComponent from "./navbar";
import CustomizedSnackbars from "./snackbar";
import CircularIndeterminate from "./loader";
import { convertUtf8ToHex } from "@walletconnect/utils";
import { awaitExpression } from "@babel/types";
import EventCard from "./card";
const Box = require("3box");
const IdentityWallet = require("identity-wallet");

interface IEventState {
  events: IEvents[];
  open: boolean;
  data: IEvents;
  walletConnector: WalletConnect | null;
  uri: string;
  connected: boolean;
  chainId: number;
  address: string;
  box: any;
  gotProfile: boolean;
  SnackOpen: boolean;
  ticket: string;
  message: string;
  variation: "error" | "success" | "warning" | "info";
  confirmation: boolean;
  flagForLogin: boolean;
}
const INITIAL_STATE: IEventState = {
  flagForLogin: true,
  events: [],
  open: false,
  SnackOpen: false,
  data: { id: 0, name: "", Date: "", location: "", img: "" },
  walletConnector: null,
  connected: false,
  chainId: 1,
  uri: "",
  address: "Login",
  box: {},
  gotProfile: false,
  message: "",
  variation: "info",
  ticket: "",
  confirmation: false
};

class HomeComponent extends React.Component<RouteComponentProps, IEventState> {
  constructor(props: any) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    };
  }

  async componentDidMount() {
    EventService.getEventData().subscribe(data => {
      this.setState({ events: data });
    });
    const walletConnector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org"
    });

    if (walletConnector.session.accounts.length) {
      await this.setState({ walletConnector: walletConnector });
      this.onSessionUpdate(walletConnector.session.accounts[0]);
      const seed = walletConnector.session.accounts[0];
      const idWallet = new IdentityWallet(this.consent, { seed });

      const provider = idWallet.get3idProvider();
      // idWallet.linkAddress(seed,provider);

      await this.setState({ box: await Box.openBox(null, provider) });

      await this.alreadyHaveTicket();
      console.log(this.state.ticket);
      console.log("box saved");
      this.setState({
        message: "Profile Loaded successfully",
        variation: "success",
        SnackOpen: true
      });
      this.setState({ gotProfile: true });
    }

    await this.subscribeToEvents();
  }

  disconnectWallet = () => {
    // const { walletConnector } = this.state;
    if (this.state.walletConnector) {
      this.state.walletConnector
        .killSession()
        .then(() => console.log("disconnected"));
    }
    this.resetApp();
  };

  public resetApp = () => {
    this.setState({
      open: false,
      SnackOpen: false,
      data: { id: 0, name: "", Date: "", location: "", img: "" },
      walletConnector: null,
      connected: false,
      chainId: 1,
      uri: "",
      address: "Login",
      box: {},
      message: "",
      variation: "info",
      ticket: "",
      gotProfile: false,
      flagForLogin: true
    });
  };

  confirmTicket = async (ticket: string) => {
    const message = "You are confirming your ticket to " + ticket;

    const msgParams = [
      convertUtf8ToHex(message), // Required
      this.state.address // Required
    ];

    // Sign personal message
    if (this.state.walletConnector) {
      this.state.walletConnector
        .signPersonalMessage(msgParams)
        .then((result: any) => {
          this.state.box.private.remove("Ticket", () =>
            this.setState({ ticket: "" })
          );
          this.setState({
            message: "Thank You For Your Visit! ",
            variation: "success",
            SnackOpen: true,
            confirmation: true
          });
        })
        .catch((error: any) => {
          // Error returned when rejected
          this.setState({
            message: "You Still have a ticket " + this.state.data.name,
            variation: "info",
            SnackOpen: true
          });
          console.error(error);
        });
    }
  };

  transaction = async () => {
    const tx = {
      from: this.state.address, // Required
      to: "0x4c6eb76d262cc6121843f74e1d18036adf03f1bf", // Required (for non contract deployments)
      data: "0x", // Required
      value: "0x00",
      gasPrice: "2100", // Optional
      gas: "1000000000",
      gasLimit: "21000", // Optional
      nonce: "0x0114" // Optional
    };
    console.log(this.state.ticket);
    await this.alreadyHaveTicket();
    // const { walletConnector } = this.state;
    if (this.state.walletConnector !== null && this.state.ticket === "") {
      this.state.walletConnector
        .sendTransaction(tx)
        .then((result: any) => {
          // Returns transaction id (hash)

          this.setState(
            {
              message: "Transaction Successfull",
              variation: "success",
              SnackOpen: true
            },
            () => this.issueTicket()
          );
          this.handleClose();
        })
        .catch((error: any) => {
          // Error returned when rejected

          this.setState({
            message: "User Rejected the Transaction",
            variation: "error",
            SnackOpen: true
          });
          this.handleClose();
        });
    } else
      this.setState({
        message: "One Ticket Per Wallet",
        variation: "info",
        SnackOpen: true
      });
  };
  alreadyHaveTicket = async () => {
    if (this.state.gotProfile === true && !(this.state.box === {})) {
      await this.state.box.private.get("Ticket").then((data: any) => {
        if (data !== null) {
          this.setState({ ticket: data });
          console.log(data);
        } else this.setState({ ticket: "" });
      });
    }
  };

  issueTicket = async () => {
    await this.state.box.private.set("Ticket", this.state.data.name, () =>
      this.setState({
        message: "Your Ticket to " + this.state.data.name + " has been booked",
        variation: "success",
        SnackOpen: true
      })
    );
  };

  VerifyTicket = async () => {
    await this.alreadyHaveTicket();
    if (this.state.connected === true) {
      if (this.state.gotProfile === false) {
        this.setState({
          message: "Wait till we load your Profile",
          variation: "warning",
          SnackOpen: true
        });
      } else if (this.state.ticket !== "") {
        await this.confirmTicket(this.state.data.name);
      } else {
        this.setState({
          message: "You dont have any tickets ",
          variation: "error",
          SnackOpen: true
        });
      }
    } else {
      this.setState({
        message: "Login to Proceed further ",
        variation: "info",
        SnackOpen: true
      });
    }
  };
  handleClose = () => {
    this.setState({ open: !this.state.open });
  };
  handleClose1 = () => {
    this.setState({ SnackOpen: !this.state.SnackOpen });
  };

  buy = (data: IEvents) => {
    if (this.state.connected) {
      if (this.state.gotProfile === false) {
        this.setState({
          message: "Wait Till we load your Profile Successfully",
          variation: "warning",
          SnackOpen: true
        });
      } else {
        this.setState({ data: data });
        this.handleClose();
      }
    } else {
      this.setState({
        message: "Login from the right uper corner ",
        variation: "info",
        SnackOpen: true
      });
    }
  };
  connectToWallet = () => {
    const walletConnector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org"
    });
    this.setState({ walletConnector: walletConnector });

    if (walletConnector) {
      if (!walletConnector.connected) {
        walletConnector.createSession().then(() => {
          // get uri for QR Code modal
          const uri = walletConnector.uri;
          // WalletConnectQRCodeModal.close();
          // display QR Code modal
          this.setState({ flagForLogin: false });
          WalletConnectQRCodeModal.open(uri, () => {
            console.log("QR Code Modal closed");
            this.setState({ flagForLogin: true });
          });
          this.subscribeToEvents();
        });
      }
    }
  };

  public subscribeToEvents = () => {
    if (!this.state.walletConnector) {
      return;
    }

    this.state.walletConnector.on(
      "session_update",
      (error: any, payload: { params: { accounts: any; chainId: any }[] }) => {
        if (error) {
          throw error;
        }

        // Get updated accounts and chainId
        const { accounts, chainId } = payload.params[0];
        const address = accounts[0];
        this.onSessionUpdate(address);
      }
    );
    this.state.walletConnector.on(
      "connect",
      (error: any, payload: { params: { accounts: any; chainId: any }[] }) => {
        if (error) {
          throw error;
        }

        this.onConnect(payload);
        // const getConsent = () => {
        //   return true;
        // };

        // // Close QR Code Modal
        // WalletConnectQRCodeModal.close();
        // // Get provided accounts and chainId
        // const { accounts, chainId } = payload.params[0];
        // sessionStorage.setItem("name", accounts);

        // this.setState({accounts : accounts[0]});
        // const seed = accounts[0]; // a hex encoded seed
      }
    );

    // Subscribe to connection events

    this.state.walletConnector.on("disconnect", (error: any, payload: any) => {
      if (error) {
        throw error;
      }
      this.onDisconnect();
      // Delete walletConnector
    });
  };
  public onSessionUpdate = async (address: string) => {
    await this.setState({ address });
    this.setState({ connected: true });
  };
  public onConnect = async (payload: any) => {
    const { chainId, accounts } = payload.params[0];
    const address = accounts[0];
    const seed = accounts[0];
    this.setState({
      connected: true,
      chainId,
      address
    });
    WalletConnectQRCodeModal.close();

    const idWallet = new IdentityWallet(this.consent, { seed });

    const provider = idWallet.get3idProvider();
    // idWallet.linkAddress(seed,provider);

    const box = await Box.openBox(null, provider);

    await box.syncDone;
    this.setState({ box: box });
    console.log("box saved");
    this.setState({
      message: "Profile Loaded successfully",
      variation: "success",
      SnackOpen: true,
      gotProfile: true
    });
  };
  onDisconnect = async () => {
    WalletConnectQRCodeModal.close();
    this.resetApp();
  };
  consent = async (req: {
    type: "authenticate";
    origin: "https://localhost:3000";
    spaces: ["my-app"];
  }) => {
    return true;
  };

  render() {
    return (
      <div>
        <AppBarComponent
          account={this.state.address}
          login={this.connectToWallet}
          logout={this.disconnectWallet}
          verify={this.VerifyTicket}
          flagForLogin={this.state.flagForLogin}
        />
        <div style={{ marginTop: 15 }}>
          {this.state.address !== "Login" && this.state.gotProfile === false ? (
            <CircularIndeterminate />
          ) : null}
        </div>
        <div style={{ marginTop: 20 }}>
          <div className="col-md-12">
            <div
              className="container"
              style={{ marginLeft: 100, borderBlockStyle: "dashed" }}
            ></div>
            <div style={{ marginTop: 30 }}>
              <div>
                {this.state.events.map((data, key) => {
                  return (
                    <div>
                      <EventCard
                        name={data.name}
                        location={data.location}
                        date={data.Date}
                        book={() => this.buy(data)}
                        gotProfile={this.state.gotProfile}
                        connected={this.state.connected}
                        address={this.state.address}
                        img={data.img}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <TicketBuyingModal
            open={this.state.open}
            handleClose={this.handleClose}
            data={this.state.data}
            transaction={this.transaction}
          />
          <CustomizedSnackbars
            className={"info"}
            message={this.state.message}
            onClose={this.handleClose1}
            handleClose={this.handleClose1}
            open={this.state.SnackOpen}
            variation={this.state.variation}
          />
        </div>
      </div>
    );
  }
}
export default HomeComponent;
