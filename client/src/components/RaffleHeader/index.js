import React, { PureComponent } from "react";

class RaffleHeader extends PureComponent {
  render() {
    return (
      <header>
        <div class="row">
          <div class="col-md-8">
            <a class="navbar-brand" href="#">
              <img src="img/logo.png" alt="" />
            </a>
          </div>
          <div class="col-md-4">
            <img src="img/header-follow-us.png" alt="" />
            <img src="img/header-social-icons.png" alt="" />
            <img src="img/header-cart.png" alt="" />
          </div>
        </div>
        <nav class="navbar sticky-top navbar-expand-lg">
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon" />
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link active" href="#home">
                  Home
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Raffles
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  How it works
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Result & info
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Play online
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Winners and Stories
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Statistic
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}

export default RaffleHeader;