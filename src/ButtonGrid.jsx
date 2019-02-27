import React, { Component } from 'react'
import './ButtonGrid.css'

class ButtonGrid extends Component
{
    render() {
        return (
          <div class="buttonGrid">
              {this.props.rows.map(
                  row => (
                      <div>
                          {row}
                      </div>
                  )
              )}
          </div>
        );
    }
}

export default ButtonGrid;