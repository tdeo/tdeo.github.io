import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPhone, faAt } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import Blowfish from 'javascript-blowfish';
import queryString from 'query-string';

import Competence from './Competence.jsx';
import './Cv.css';

const translations = {
  'fr': require('./fr.json'),
  'en': require('./en.json'),
};

export default class Cv extends React.Component {
  static propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string
    })
  };

  constructor(props) {
    super(props);
    var values = queryString.parse(this.props.location.search);
    this.key = (values.key === undefined) ? '' : values.key;
    this.lang = values.lang;
    if (translations[this.lang] === undefined) {
      this.lang = 'fr';
    }
    this.data = translations[this.lang];
  }

  validKey() {
    var bf = new Blowfish(this.key);
    return (bf.decrypt(atob('ug1IZGf/ZRM=')).replace(/\0/g, '') === 'valid');
  }

  address() {
    var bf = new Blowfish(this.key);
    var res = [
      bf.decrypt(atob('9UONn1uavsEpD6xp20Kw+g==')).replace(/\0/g, ''),
      bf.decrypt(atob('QhWS8cl5kBBC1EsymLe6HA==')).replace(/\0/g, ''),
    ];
    return res;
  }

  phoneNumber() {
    var bf = new Blowfish(this.key);
    var res = bf.decrypt(atob('JENaEBg9eE/VmFDwpQ8qtB5Kicq9cNIo')).replace(/\0/g, '');
    return res;
  }

  componentDidMount() {
    document.title = 'CV - Thierry Deo';
  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12} sm={4} className="left-panel">
              <Row>
                <Col xs={12}>
                  <img id="picture" alt="" src={this.data.picture} />
                  <h3 className="text-center">{this.data.name}</h3>
                  <h5 className="text-center">{this.data.title}</h5>
                </Col>
              </Row>

              <hr />

              <Row>
                <Col xs={12} id="contact">
                  <small>
                    {this.validKey() && <p>
                      {this.address().map((line, i) => {
                        return (
                          <span key={i}>
                            <FontAwesomeIcon className={(i === 0) ? '' : 'invisible'} icon={faHome} /> {line}
                            <br />
                          </span>
                        );
                      })}
                    </p>}
                    {this.validKey() && <p>
                      <FontAwesomeIcon icon={faPhone} /> {this.phoneNumber()}
                    </p>}
                    <p>
                      <FontAwesomeIcon icon={faAt} /> {this.data.email}
                    </p>
                    <p>
                      <FontAwesomeIcon icon={faGithub} /> {this.data.github}
                    </p>
                  </small>
                </Col>
              </Row>

              <hr />

              <Row>
                <Col xs={12} className="text-justify">
                  {this.data.pitch.map((s, i) => {
                    return (
                      <p key={i}>{s}</p>
                    );
                  })}
                </Col>
              </Row>

              <hr />

              <Row>
                {this.data.languages.map((item, i) => {
                  return (
                    <Competence key={i} percent={item.val} desc={item.desc} />
                  );
                })}
              </Row>

              <hr />

              <Row>
                {this.data.skills.map((item, i) => {
                  return (
                    <Competence key={i} percent={item.val} desc={item.desc} />
                  );
                })}
              </Row>
            </Col>
            <Col xs={0} />


            <Col xs={12} sm={8} className="right-panel">
              <Row>
                <Col xs={12}><h3>{this.data.pro_exp.title}</h3></Col>
              </Row>

              {this.data.pro_exp.items.map((item, i) => {
                return (
                  <Row key={i}>
                    <Col xs={12} sm={5}>
                      <h4 className='small-caps' dangerouslySetInnerHTML={{ __html: item.company }} />
                    </Col>
                    <Col sm={7} xs={12}>
                      <h5 className='place_and_time' dangerouslySetInnerHTML={{ __html: '<place class="small-caps">' + item.place + '</place>&nbsp;-&nbsp;' + item.date }} />
                    </Col>
                    <Col xs={12}>
                      {item.text.map((text, i) => {
                        return (
                          <p key={i} dangerouslySetInnerHTML={{ __html: text }} />
                        );
                      })}
                      <ul>
                        {item.bullets.map((bullet, i) => {
                          return (
                            <li key={i} dangerouslySetInnerHTML={{ __html: bullet }} />
                          );
                        })}
                      </ul>
                    </Col>
                  </Row>
                );
              })}

              <Row>
                <Col xs={12}><h3>{this.data.education.title}</h3></Col>
              </Row>

              {this.data.education.items.map((item, i) => {
                return (
                  <div key={i}>
                    <Col xs={12} sm={9}>
                      <h4 className='small-caps' dangerouslySetInnerHTML={{ __html: item.school }} />
                    </Col>
                    <Col sm={3} xs={12}>
                      <h5 className='place_and_time' dangerouslySetInnerHTML={{ __html: item.date }} />
                    </Col>
                    <Col xs={12}>
                      {item.text.map((text, i) => {
                        return (
                          <p key={i} dangerouslySetInnerHTML={{ __html: text }} />
                        );
                      })}
                    </Col>
                  </div>
                );
              })}

              <Row>
                <Col xs={12}><h3>{this.data.interests.title}</h3></Col>
              </Row>

              <Row>
                <Col xs={12}>
                  <dl className="dl-horizontal">
                    {this.data.interests.items.map((item, i) => {
                      return (
                        <React.Fragment key={i}>
                          <dt>{item.name}</dt>
                          <dd>{item.desc}</dd>
                        </React.Fragment>
                      );
                    })}
                  </dl>
                </Col>
              </Row>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
