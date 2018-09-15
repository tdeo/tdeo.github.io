import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPhone, faAt } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import Blowfish from 'javascript-blowfish';
import queryString from 'query-string';

import './Cv.css';

export default class Cv extends React.Component {
  static propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string
    })
  };

  key() {
    const values = queryString.parse(this.props.location.search);
    if (values.key === undefined) {
      return '';
    }
    return values.key;
  }

  validKey() {
    var bf = new Blowfish(this.key());
    return (bf.decrypt(atob('ug1IZGf/ZRM=')).replace(/\0/g, '') === 'valid');
  }

  address() {
    var bf = new Blowfish(this.key());
    var res = [
      bf.decrypt(atob('hW++eFDKMmFj3Qpyr9OtSnaIdEVL+Wlivs+uTmIEJg8=')).replace(/\0/g, ''),
      bf.decrypt(atob('QhWS8cl5kBBC1EsymLe6HA==')).replace(/\0/g, ''),
    ];
    return res;
  }

  phoneNumber() {
    var bf = new Blowfish(this.key());
    var res = bf.decrypt(atob('JENaEBg9eE/VmFDwpQ8qtB5Kicq9cNIo')).replace(/\0/g, '');
    return res;
  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12} sm={4}>
              <img id="picture" alt="" src="/images/thierry.jpg" />
              <h3 className="text-center">Thierry Deo</h3>
              <h5 className="text-center">Ingénieur en développement logiciel</h5>
              <hr />
              {this.validKey() && <h5>
                {this.address().map((line, i) => {
                  return (
                    <span key={i}>
                      <FontAwesomeIcon className={(i === 0) ? '' : 'invisible'} icon={faHome} /> {line}
                      <br />
                    </span>
                  );
                })}
              </h5>}
              {this.validKey() && <h5>
                <FontAwesomeIcon icon={faPhone} /> {this.phoneNumber()}
              </h5>}
              <h5>
                <FontAwesomeIcon icon={faAt} /> thierry.deo@gmail.com
              </h5>
              <h5>
                <FontAwesomeIcon icon={faGithub} /> https://github.com/tdeo
              </h5>
            </Col>
            <Col xs={12} sm={8} className="main-panel">
              <Row>
                <Col xs={12}><h3>Expérience professionelle</h3></Col>
              </Row>
              <Row>
                <Col xs={12} sm={8}><h4 className='small-caps'>Booking.com</h4></Col>
                <Col sm={4} xsHidden><h5 className='text-right'> Juill.&nbsp;2015&nbsp;-&nbsp;Août&nbsp;2018</h5></Col>
                <Col xs={12} smHidden mdHidden lgHidden><h5> Juill.&nbsp;2015&nbsp;-&nbsp;Août&nbsp;2018</h5></Col>
              </Row>
              <Row>
                <Col xs={12}>
                  Transfert suite au rachat de PriceMatch, Développeur Senior et Team Lead.
                  <ul>
                    <li>
                      Intégration du produit avec les structures de donnés existantes, scaling du code et de l&apos;infrastructure de 1000 à 200&nbsp;000 clients.
                    </li>
                    <li>
                      Migration de l&apos;infrastructure: bases de données MySQL et NoSQL,
                      déploiements en utilisant <i>Docker</i> et <i>OpenShift</i>.
                    </li>
                    <li>
                      Mise en place de nombreux outils pour l&apos;environnement de développement: réplication de
                      bases de données, utilisation de <i>Docker</i>, automatisation du pipeline de test et
                      déploiement.
                    </li>
                  </ul>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={8}><h4 className='small-caps'>PriceMatch <small> - start-up</small></h4></Col>
                <Col sm={4} xsHidden><h5 className='text-right'> Juill.&nbsp;2014&nbsp;-&nbsp;Juill.&nbsp;2015</h5></Col>
                <Col xs={12} smHidden mdHidden lgHidden><h5> Juill.&nbsp;2014&nbsp;-&nbsp;Juill.&nbsp;2015</h5></Col>
              </Row>
              <Row>
                <Col xs={12}>
                  Développeur au sein d&apos;une équipe de 6.
                  <ul>
                    <li>
                      Développement du produit de yield management pour l&apos;hôtellerie: back-end en <i>Ruby on Rails</i>,
                      conception des bases de données et de nouvelles fonctionnalités.
                    </li>
                    <li>
                      Orchestration des serveurs et de l&apos;infrastructure avec <i>AWS</i>, automatisation grâce à <i>Chef</i>.
                    </li>
                    <li>
                      Développement ad hoc sur d&apos;autres projets: maintenance de notre site marketing, écriture de nos
                      algorithmes de yield management, nouvelles fonctionnalités front-end (<i>Backbone.js</i> et <i>Marionette.js</i>)
                    </li>
                  </ul>
                </Col>
              </Row>
              <Row>
                <Col xs={12}><h3>Formation</h3></Col>
              </Row>
              <Row>
                <Col xs={12} sm={8}><h4 className='small-caps'>Télécom ParisTech <small> - Diplôme d&apos;ingénieur</small></h4></Col>
                <Col sm={4} xsHidden><h5 className='text-right'> 2013&nbsp;-&nbsp;2014</h5></Col>
                <Col xs={12} smHidden mdHidden lgHidden><h5> 2013&nbsp;-&nbsp;2014</h5></Col>
              </Row>
              <Row>
                <Col xs={12}>
                  Parcours <i>Ingénierie du logiciel</i>.<br />
                  Réalisation d&apos;un projet en Python sur la simulation de l&apos;émergence d&apos;un langage de communication
                  par des algorithmes génétiques.
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={8}><h4 className='small-caps'>École polytechnique <small> - Diplôme d&apos;ingénieur</small></h4></Col>
                <Col sm={4} xsHidden><h5 className='text-right'> 2010&nbsp;-&nbsp;2013</h5></Col>
                <Col xs={12} smHidden mdHidden lgHidden><h5> 2010&nbsp;-&nbsp;2013</h5></Col>
              </Row>
              <Row>
                <Col xs={12}>
                  Parcours <i>Optimisation</i> en mathématiques appliquées et informatique.<br />
                  Stage militaire de 9 mois à bord de la frégate <i>Cassard</i>&nbsp;:
                  préparation opérationelle de l&apos;équipage avant départ en mission.
                </Col>
              </Row>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
