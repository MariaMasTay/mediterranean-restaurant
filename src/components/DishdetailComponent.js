import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Button, Row, Col, Label, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';


  function RenderDish({dish}) {
    if (dish != null) {
      return(
        <div className='col-12 col-md-5 m-1'>

        <FadeTransform in transformProps={{exitTransform: 'scale(0.5) translateY(-50%)'}}>

            <Card>
                <CardImg width="100%" src={baseUrl + dish.image} alt={dish.name} />
                <CardBody>
                  <CardTitle>{dish.name}</CardTitle>
                  <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>

        </FadeTransform>
        </div>
      );
    } else {return (<div></div>);}
  }


  function RenderComments({comments, postComment, dishId}) {
        if (comments == null) {
            return (<div></div>)
        }

        let comm = comments.map(comment => {
          return (

            <Stagger in>
            <Fade in>

            <li key={comment.id}>
                <p>{comment.comment}</p>
                <p>{comment.author},
                {new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit'
                    }).format(new Date(comment.date))}
                </p>
            </li>

            </Fade>
            </Stagger>
          )
        })

        return (
          <div className='col-12 col-md-5 m-1 text-left'>
            <h4> Comments </h4>
            <ul className='list-unstyled'>
                {comm}
            </ul>
            <CommentForm dishId={dishId} postComment={postComment} />
          </div>
        )
    }


const  DishDetail = (props) => {

  if (props.isLoading) {
      return(
          <div className="container">
              <div className="row">
                  <Loading />
              </div>
          </div>
      );
  }

  else if (props.errMess) {
      return(
          <div className="container">
              <div className="row">
                  <h4>{props.errMess}</h4>
              </div>
          </div>
      );
  }

  else if (props.dish != null) {
    return (
      <div class="container">

            <div className="row">
              <Breadcrumb>
                  <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                  <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
              </Breadcrumb>
              <div className="col-12">
                  <h3>{props.dish.name}</h3>
                  <hr />
              </div>
            </div>

            <div className="row">
                <RenderDish dish={props.dish} />

                <RenderComments comments={props.comments}
                postComment={props.postComment}
                dishId={props.dish.id}
                />


            </div>



      </div>
  )}

  else {
    return (<div></div>)
  }
}


const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);


class CommentForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isModalOpen: false
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleModal() {
        this.setState({ isModalOpen: !this.state.isModalOpen });
    }

    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }

    render() {

      return (
          <div>
            <Button type="button" color="primary" onClick={this.toggleModal}>
            Submit Comment
            </Button>


            <div className="row row-content">
              <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}> Submit comment</ModalHeader>

                <ModalBody>
                    <div className="col-12 col-md-9">
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)} >

                            <Row className="form-group">
                                <Label htmlFor="rating">Rating</Label>
                                <Control.select model=".rating" name="rating" className="form-control" >
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Control.select>
                            </Row>

                            <Row className="form-group">
                              <Label htmlFor="yourname">Your name</Label>
                              <Control.text model="yourname" id="yourname" name="yourname" placeholder="Your Name" className="form-control" validators={{ required, minLength: minLength(3), maxLength: maxLength(15) }} />
                              <Errors className="text-danger" model=".author" show="touched" messages={{ required: 'Required', minLength: 'Must be greater than 3 characters', maxLength: 'Must be 15 charaters or less' }} />
                            </Row>


                            <Row className="form-group">
                              <Label htmlFor="comment">Comment</Label>
                              <Control.textarea model=".comment" id="comment" name="comment" rows="6" className="form-control" validators={{ required }} />
                              <Errors className="text-danger" model=".comment" show="touched" messages={{ required: 'Required' }} />
                            </Row>


                            <Row className="form-group">
                              <Button type="submit" color="primary" value="submit">
                              Submit
                              </Button>
                            </Row>


                      </LocalForm>

                    </div>
                </ModalBody>
                </Modal>
            </div>
        </div>
      );
    }
}










export default DishDetail;
