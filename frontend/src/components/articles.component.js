import React, { Component } from "react";
import axios from "axios";

const Article = (props) => (
    <div className="article">
        <div className="article-content">
            <a href={props.article.url}>
                <h3>{props.article.title}</h3>
            </a>
        </div>
    </div>
);

export default class Articles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
        };
    }

    componentDidMount() {
        this.fetchArticles();
    }

    fetchArticles = () => {
        axios
            .get("http://localhost:4000/articles")
            .then((res) => {
                if (res.status === 200) {
                    console.log(res);
                    this.setState({ articles: res.data });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    displayArticles = () => {
        return this.state.articles.map((article, key) => {
            return <Article article={article} key={key} />;
        });
    };

    render() {
        return (
            <div>
                <div className="avis">
                    <h3>Dagbladet</h3>
                    {this.displayArticles()}
                </div>
            </div>
        );
    }
}
