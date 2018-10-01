// @flow
import React from 'react'

type PropsType = {
  dispatch: Function,
}

type StateType = {
  isLoading: bool,
}

const withLoader = (
  loader: (dispatch: Function, props: Object) => Promise<any>,
  BaseComponent: typeof React.Component | Function,
  cacheKey?: string
) => (
  class LoadingComponent extends React.Component<PropsType, StateType> {
    constructor(props: PropsType) {
      super(props)
      this.state = { isLoading: true }
    }

    state: StateType

    componentWillMount() {
      loader(this.props.dispatch, this.props).then(
        () => this.setState({ isLoading: false })
      )
    }

    componentWillReceiveProps(newProps: any) {
      if (cacheKey && this.props[cacheKey] !== newProps[cacheKey]) {
        this.setState({ isLoading: true })

        loader(this.props.dispatch, newProps).then(
          () => this.setState({ isLoading: false })
        )
      }
    }

    props: { dispatch: Function }

    render() {
      return (
        <BaseComponent {...this.props} isLoading={this.state.isLoading} />
      )
    }
  }
)

export default withLoader