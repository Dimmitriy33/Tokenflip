import "./styles/main.scss";
// watch: native intellisense and file-peek for aliases from jsconfig.json and with none-js files doesn't work: https://github.com/microsoft/TypeScript/issues/29334
// start-path is 'images' because we have an alias 'images' in webpack.common.js
import { Component } from "react";
import ReactDOM from "react-dom/client";
import { WUPFormElement, WUPTextControl } from "web-ui-pack";
import { useBuiltinStyle, WUPcssButton, WUPcssScrollSmall } from "web-ui-pack/styles";
import MainRouter from "./mainRouter";
import Footer from "./components/footer/footer";
import { MetaMaskContextProvider } from "./elements/metamask/useMetaMask";

// prepend scroll style for class '.scrolled' into document.head
useBuiltinStyle(WUPcssScrollSmall(".scrolled"));
// prepend button style for class '.btn' into document.head
useBuiltinStyle(WUPcssButton(".btn"));

!(WUPFormElement && WUPTextControl) && console.warn("err");

interface AppProps {
  nothing: boolean;
}

interface AppState {
  title: string;
}

class AppContainer extends Component<AppProps, AppState> {
  // ["constructor"]: typeof AppContainer;

  constructor(props: AppProps) {
    super(props);
    // this.state = {
    //   //
    // };
    // test class-dead-code
    const goExlcude = true;
    if (!goExlcude) {
      console.warn("class-dead-code doesn't work", props.nothing);
    }
  }

  render() {
    return (
      // <StrictMode>
      <MetaMaskContextProvider>
        <MainRouter />
        <Footer />
      </MetaMaskContextProvider>
      // </StrictMode>
    );
  }
}

ReactDOM.createRoot(document.getElementById("app")!).render(<AppContainer nothing={false} />);
